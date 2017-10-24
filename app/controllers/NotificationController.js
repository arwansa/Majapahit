const twitter = require('twitter-text');
const request = require('request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const config = require('../config');
const formatter = require('../utilities/Formatter');

const NotificationController = {

    post: function(req, res, next) {
        const extractMentions = twitter.extractMentions(req.post.caption).toLocaleString().toLowerCase();

        User.find({
            username: {
                $in: extractMentions.length > 0 ? extractMentions.split(',') : []
            }
        }, '_id device', function(err, users) {
            if (err) {
                console.log(err);
                return next();
            }

            if (users.length == 0) {
                console.log('Users not found');
                return next();
            }

            let deviceArray = [];
            let receiverArray = [];

            for (let i = 0; i < users.length; i++) {
                if (!req.authUser._id.equals(users[i]._id)) {
                    deviceArray.push(users[i].device);
                    receiverArray.push(users[i]._id);
                }
            }

            const data = {
                user: req.authUser,
                data: req.post,
                type: 'mention_in_post',
                contents: req.authUser.username + ' mention you in a post : ' + req.post.caption
            };

            sendPushNotification(deviceArray, data);

            Notification.findOne({
                mention_in_post: req.post._id
            }, function(err, notification) {
                if (err) {
                    console.log(err);
                    return next();
                }

                if (!notification) {
                    const notification = new Notification({
                        sender: req.authUser._id,
                        receivers: receiverArray,
                        mention_in_post: req.post._id
                    });

                    notification.save(function(err) {
                        if (err) {
                            console.log(err);
                            return next();
                        }
                    });
                } else {
                    notification.receivers = receiverArray;
                    notification.save(function(err) {
                        if (err) {
                            console.log(err);
                            return next();
                        }
                    });
                }
                next();
            });
        });
    },

    commentInMyPost: function(req, res, next) {
        User.findOne({
            _id: req.post.user
        }, '_id device', function(err, user) {
            if (err) {
                console.log(err);
                return next();
            }

            if (!user) {
                console.log('User not found');
                return next();
            }

            if (req.authUser._id.equals(user._id)) {
                console.log("It's me");
                return next();
            }

            const data = {
                user: req.authUser,
                data: req.comment,
                type: 'commented_in_your_post',
                contents: req.authUser.username + ' commented in your post : ' + req.comment.text
            };

            sendPushNotification(user.device, data);

            Notification.findOne({
                commented_in_your_post: req.comment._id
            }, function(err, notification) {
                if (err) {
                    console.log(err);
                    return next();
                }

                if (!notification) {
                    const notification = new Notification({
                        sender: req.authUser._id,
                        receivers: [user._id],
                        post: req.post._id,
                        commented_in_your_post: req.comment._id
                    });

                    notification.save(function(err) {
                        if (err) {
                            console.log(err);
                            return next();
                        }
                    });
                }
            });
            next();
        });
    },

    mentionInComment: function(req, res, next) {
        const extractMentions = twitter.extractMentions(req.comment.text).toLocaleString().toLowerCase();

        User.find({
            username: {
                $in: extractMentions.length > 0 ? extractMentions.split(',') : []
            }
        }, '_id device', function(err, users) {
            if (err) {
                console.log(err);
                return next();
            }

            if (users.length == 0) {
                console.log('User not found');
                return next();
            }

            let deviceArray = [];
            let receiverArray = [];

            for (let i = 0; i < users.length; i++) {
                if (!req.authUser._id.equals(users[i]._id)) {
                    deviceArray.push(users[i].device);
                    receiverArray.push(users[i]._id);
                }
            }

            const data = {
                user: req.authUser,
                data: req.comment,
                type: 'mention_in_comment',
                contents: req.authUser.username + ' mention you in a comment : ' + req.comment.text
            };

            sendPushNotification(deviceArray, data);

            Notification.findOne({
                mention_in_comment: req.comment._id
            }, function(err, notification) {
                if (err) {
                    console.log(err);
                    return next();
                }

                if (!notification) {
                    const notification = new Notification({
                        sender: req.authUser._id,
                        receivers: receiverArray,
                        post: req.post._id,
                        mention_in_comment: req.comment._id
                    });

                    notification.save(function(err) {
                        if (err) {
                            console.log(err);
                            return next();
                        }
                    });
                } else {
                    notification.receivers = receiverArray;
                    notification.save(function(err) {
                        if (err) {
                            console.log(err);
                            return next();
                        }
                    });
                }
            });
            next();
        });
    },

    like: function(req, res, next) {
        User.findOne({
            _id: req.post.user
        }, '_id device', function(err, user) {
            if (err) {
                console.log(err);
                return next();
            }

            if (!user) {
                console.log('User not found');
                return next();
            }

            if (req.authUser._id.equals(user._id)) {
                console.log("It's me");
                return next();
            }

            const data = {
                user: req.authUser,
                data: req.post,
                type: 'liked_your_post',
                contents: req.authUser.username + ' liked your post'
            };

            sendPushNotification(user.device, data);

            const notification = new Notification({
                sender: req.authUser._id,
                receivers: [user._id],
                liked_your_post: req.post._id
            });

            notification.save(function(err) {
                if (err) {
                    console.log(err);
                    return next();
                }
            });

            next();
        });
    },

    follow: function(req, res, next) {
        const data = {
            user: req.authUser,
            data: req.authUser,
            type: 'following_you',
            contents: req.authUser.username + ' following you'
        };

        sendPushNotification(req.user.device, data);

        const notification = new Notification({
            sender: req.authUser._id,
            receivers: [req.user._id],
            following_you: req.authUser._id
        });

        notification.save(function(err) {
            if (err) {
                console.log(err);
                return next();
            }
        });

        next();
    },

    readAll: function(req, res, next) {
        const query = formatter.pagination({
            receivers: req.authUser._id
        }, req.query.last_id, false);

        Notification.find(query)
            .populate('sender', 'username avatar')
            .populate('post', 'file_name caption is_video')
            .populate('mention_in_post', 'file_name caption is_video')
            .populate('commented_in_your_post', 'text')
            .populate('mention_in_comment', 'text')
            .populate('liked_your_post', 'file_name caption is_video')
            .populate('following_you', 'username avatar')
            .sort({
                date: -1
            })
            .exec(function(err, notifications) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find notifications"));
                    return next(false);
                };

                if (notifications.length == 0) {
                    res.send(404, formatter.error(null, 'notifications not found'));
                    return next(false);
                }
                res.send(formatter.success(notifications, 'get notifications successfully'))
                next();
            });
    },

    unlike: function(req, res, next) {
        Notification.remove({
            liked_your_post: req.post._id
        }, function(err) {
            if (err) {
                console.log(err);
                return next();
            }
            next();
        });
    },

    unfollow: function(req, res, next) {
        Notification.remove({
            following_you: req.follow.following
        }, function(err) {
            if (err) {
                console.log(err);
                return next();
            }
            next();
        });
    },

    deleteComment: function(req, res, next) {
        const query = {
            $or: [{
                    commented_in_your_post: req.comment._id
                },
                {
                    mention_in_comment: req.comment._id
                }
            ]
        };

        Notification.remove(query, function(err) {
            if (err) {
                console.log(err);
                return next();
            }
            next();
        });
    },

    deletePost: function(req, res, next) {
        const query = {
            $or: [{
                    post: req.post._id
                },
                {
                    liked_your_post: req.post._id
                },
                {
                    mention_in_post: req.post._id
                }
            ]
        };

        Notification.remove(query, function(err) {
            if (err) {
                console.log(err);
                return next();
            }
            next();
        });
    },

    deleteUser: function(req, res, next) {
        const query = {
            $or: [{
                    sender: req.authUser._id
                },
                {
                    post: {
                        $in: req.authUser.posts
                    }
                },
                {
                    liked_your_post: {
                        $in: req.authUser.posts
                    }
                },
                {
                    mention_in_post: {
                        $in: req.authUser.posts
                    }
                }
            ]
        };

        Notification.remove(query, function(err) {
            if (err) {
                console.log(err);
                return next();
            }
            next();
        });
    }
};

const sendPushNotification = function(device, data) {
    const notification = {
        method: 'POST',
        uri: 'https://onesignal.com/api/v1/notifications',
        headers: {
            "authorization": "Basic " + config.oneSignalKey,
            "content-type": "application/json"
        },
        json: true,
        body: {
            'app_id': config.oneSignalAppID,
            'contents': {
                en: data.contents
            },
            'data': data,
            'include_player_ids': Array.isArray(device) ? device : [device]
        }
    };

    request(notification, function(error, response, body) {
        if (!body.errors) {
            console.log(body);
        } else {
            console.log(body.errors);
        }
    });
};

module.exports = NotificationController;
