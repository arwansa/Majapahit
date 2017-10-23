const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firebase_uid: {
        type: String,
        default: null
    },
    device: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    username: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followings: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

UserSchema.index({
    username: 'text'
});

module.exports = UserSchema;
