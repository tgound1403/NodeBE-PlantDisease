const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
  userId: {
    type: String,
    required: true,
    default: '',
  },
  creatorAvatar: String,
  creator: String,
  createTime: Date,
  status: String,
  imageInfo: {
    filename: String,
    contentType: String,
    data: Buffer,
    imgBase64: String
  },
  imageSrc: String,
  comment: [String],
  like: [String],
  unlike: [String],
}, { timestamp: true });
// Model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;