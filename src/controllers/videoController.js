import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import url from 'url';
import session from 'express-session';

export const home = async (req, res) => {
  const videos = await Video.find({}).populate('owner');
  return res.render('home', { pageTitle: 'Home', videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('owner').populate('comments');
  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  return res.render('watch', { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect('/');
  }
  return res.render('edit', { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== _id) {
    req.flash('error', 'Not Authorized.');
    return res.status(403).redirect('/');
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash('success', 'Updated.');
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumbnail } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: res.locals.isHeroku ? video[0].location : video[0].path,
      thumbnailUrl: res.locals.isHeroku
        ? thumbnail[0].location
        : thumbnail[0].path,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash('success', 'Uploaded.');
    return res.redirect('/');
  } catch (error) {
    return res.status(400).render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: error._message,
    });
  }
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect('/');
  }
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    }).populate('owner');
  }
  return res.render('search', { pageTitle: 'Search', videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const {
    locals: { isHeroku },
  } = res;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    username: user.username,
    avatar: user.avatarUrl,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({
    newCommentId: comment._id,
    user,
    createdAt: Number(comment.createdAt),
    isHeroku,
  });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id: commentId },
    session: {
      user: { _id: loggedInUser },
    },
  } = req;
  const videoId = req.headers.referer.split('videos/')[1];
  const comment = await Comment.findById(commentId);
  const owner = comment.owner;

  if (loggedInUser !== owner.toString()) {
    req.flash('error', 'Not Authorized.');
    return res.sendStatus(404);
  }

  const video = await Video.findById(videoId);
  await Comment.deleteOne(comment);
  await video.comments.remove(commentId);
  video.save();

  return res.sendStatus(201);
};
