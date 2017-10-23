const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    caption: {
        type: String,
        default: null
    },
    file_name: {
        type: String,
        default: null
    },
    is_video: {
        type: Boolean,
        default: false
    },
    hashtags: [{
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = PostSchema;
