const mongoose = require('mongoose');
const PostSchema = require('../schema/PostSchema');

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
