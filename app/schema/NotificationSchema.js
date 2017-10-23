const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receivers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following_you: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    mention_in_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    liked_your_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    commented_in_your_post: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    mention_in_comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }
});

module.exports = NotificationSchema;
