import User from '../models/User';
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
  const user = await User.findOne({ username });
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

export const getEditProfile = (req, res, next) => {};

export const postEditProfile = (req, res, next) => {};

export const logout = (req, res) => {};

export const userProfile = (req, res, next) => {};
