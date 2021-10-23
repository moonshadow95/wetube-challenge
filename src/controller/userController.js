import User from '../models/User';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => {
  return res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = 'Join';
  if (password !== password2) {
    return res.render(400).render('join', {
      pageTitle,
      errorMessage: 'Password confirmation does not match.',
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'Username or Email already in use.',
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      password2,
      location,
    });
    return res.redirect('/login');
  } catch (error) {
    return res
      .status(400)
      .render('join', { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  return res.render('login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = 'Login';
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'An account with this username does not exist.',
    });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'Wrong password.',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export const startGithubLogin = (req, res, next) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SCRETE,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res, next) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })
  ).json();
  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect('/login');
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: '',
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
};

export const userProfile = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate('videos');
  console.log(user);
  if (!user) {
    return res.status(404).render('404', { pageTitle: 'User not found' });
  }
  return res.render('users/profile', {
    pageTitle: user.username,
    user,
  });
};

export const getEditProfile = (req, res, next) => {
  return res.render('edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEditProfile = async (req, res) => {
  const {
    file,
    body: { name, email: newEmail, username: newUsername, location },
    session: {
      user: { _id, email, username, avatarUrl },
    },
  } = req;
  let comparison = [];

  if (newEmail !== email) {
    comparison.push({ email: newEmail });
  }
  if (newUsername !== username) {
    comparison.push({ username: newUsername });
  }
  if (comparison.length > 0) {
    const existingUser = await User.findOne({ $or: comparison });
    if (existingUser && existingUser._id.toString() !== _id) {
      return res.status(400).render('edit-profile', {
        pageTitle: 'Edit Profile',
        errorMessage: 'Username/Email already in use.',
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email: newEmail,
      username: newUsername,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect('/users/edit');
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect('/');
  }
  return res.render('users/change-password', { pageTitle: 'Change Password' });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { currentPassword, newPassword, newPasswordConfirmation },
    session: {
      user: { _id, password },
    },
  } = req;
  const ok = await bcrypt.compare(currentPassword, password);
  if (!ok) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The current password is incorrect.',
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'New passwords do not match.',
    });
  }

  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  return res.redirect('/users/logout');
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};
