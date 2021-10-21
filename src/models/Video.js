import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 40 },
  // fileUrl: { type: String, required: true },
  // thumbnailUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxlength: 300 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    likes: { type: Number, default: 0, required: true },
  },
  // owner:{}
  // comments:{}
});

videoSchema.static('formatHashtags', function (hashtags) {
  return hashtags
    .split(',')
    .map((tag) =>
      tag.trim().startsWith('#') ? tag : `#${tag.replace(' ', '')}`
    );
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
