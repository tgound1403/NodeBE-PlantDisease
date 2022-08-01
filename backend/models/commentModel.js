// import { Date } from 'mongoose';
const mongoose = require('mongoose');

// Schema: how data going to be
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  username: String,
  createdAt: Date,
  body: String
});
// Model
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;