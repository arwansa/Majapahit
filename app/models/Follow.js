const mongoose = require('mongoose');
const FollowSchema = require('../schema/FollowSchema');

const Follow = mongoose.model('Follow', FollowSchema);

module.exports = Follow;
