import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 40 },
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxLength: 500 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((tag) =>
      tag.trim().startsWith("#") ? tag : `#${tag.replace(" ", "")}`
    );
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
