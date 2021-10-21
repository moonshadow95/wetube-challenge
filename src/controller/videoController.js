import Video from '../models/Video';

export const home = async (req, res, next) => {
  const videos = await Video.find({});
  return res.render('home', { pageTitle: 'Home', videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  return res.render('watch', { pageTitle: video.title, video });
};

export const getEdit = (req, res, next) => {};

export const postEdit = (req, res, next) => {};

export const getUpload = (req, res, next) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res, next) => {
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect('/');
  } catch (error) {
    res.status(400).render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = (req, res, next) => {};

export const search = (req, res, next) => {};
