const mongoose = require('mongoose');
const CommentSchema = require('../schema/CommentSchema');

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
