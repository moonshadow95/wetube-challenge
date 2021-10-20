import Video from '../models/Video';

export const home = async (req, res, next) => {
  const videos = await Video.find({});
  return res.render('home', { pageTitle: 'Home', videos });
};

export const watch = (req, res) => {};

export const getEdit = (req, res, next) => {};

export const postEdit = (req, res, next) => {};

export const getUpload = (req, res, next) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = (req, res, next) => {};

export const deleteVideo = (req, res, next) => {};

export const search = (req, res, next) => {};
