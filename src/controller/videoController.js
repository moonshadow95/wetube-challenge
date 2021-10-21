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

export const getUpload = (req, res, next) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res, next) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
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

export const getEdit = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  return res.render('edit', { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const video = await Video.findById(id);
  console.log(video);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};

export const search = (req, res, next) => {};
