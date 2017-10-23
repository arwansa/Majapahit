const mongoose = require('mongoose');
const LikeSchema = require('../schema/LikeSchema');

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
