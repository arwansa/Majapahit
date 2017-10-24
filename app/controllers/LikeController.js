const validator = require('validator');
const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const formatter = require('../utilities/Formatter');

const LikeController = {
    like: function(req, res, next) {
        if (!req.params.pid || !validator.isMongoId(req.params.pid + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        Post.findOne({
            _id: req.params.pid
        }, '_id user', function(err, post) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find post"));
                return next(false);
            }

            if (!post) {
                res.send(404, formatter.error(null, 'post not found'));
                return next(false);
            }

            Like.findOne({
                user: req.authUser._id,
                post: req.params.pid
            }, function(err, liked) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find like"));
                    return next(false);
                }

                if (!!liked) {
                    res.send(formatter.success(null, 'like successfully'));
                    return next(false);
                }

                const like = new Like({
                    user: req.authUser._id,
                    post: req.params.pid
                });

                like.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't like"));
                        return next(false);
                    }

                    res.send(formatter.success(null, 'like successfully'));

                    Post.update({
                        _id: req.params.pid
                    }, {
                        $push: {
                            'likes': req.authUser._id
                        }
                    }, function(err, res) {
                        console.log(err);
                    });

                    req.post = post;

                    next();
                });
            });
        });
    },

    unlike: function(req, res, next) {
        if (!req.params.pid || !validator.isMongoId(req.params.pid + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        Post.findOne({
            _id: req.params.pid
        }, '_id user', function(err, post) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find post"));
                return next(false);
            }

            if (!post) {
                res.send(404, formatter.error(null, 'post not found'));
                return next(false);
            }

            Like.findOne({
                user: req.authUser._id,
                post: req.params.pid
            }, function(err, like) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find like"));
                    return next(false);
                }

                if (!like) {
                    res.send(formatter.success(null, 'unlike successfully'));
                    return next(false);
                }

                like.remove(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't unlike"));
                        return next(false);
                    }
                });

                res.send(formatter.success(null, 'unlike successfully'));

                Post.update({
                    _id: req.params.pid
                }, {
                    $pull: {
                        'likes': req.authUser._id
                    }
                }, function(err, res) {
                    console.log(err);
                });

                req.post = post;

                next();
            });
        });
    },

    deletePost: function(req, res, next) {
        Like.remove({
            post: req.post._id
        }, function(err) {
            if (err) console.log(err);
            next();
        });
    },

    deleteUser: function(req, res, next) {
        const query = {
            $or: [{
                    user: req.authUser._id
                },
                {
                    post: {
                        $in: req.authUser.posts
                    }
                }
            ]
        };

        Like.remove(query, function(err) {
            if (err) console.log(err);
            next();
        });
    },

    activity: function(req, res, next) {
        User.findOne({
            _id: req.authUser._id
        }, 'followings', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, 'user not found'));
                return next(false);
            }

            const followings = user.followings;

            const query = formatter.pagination({
                user: {
                    $in: followings
                }
            }, req.query.last_id, false);

            Like.find(query)
                .populate('user', 'username avatar')
                .populate({
                    path: 'post',
                    select: 'caption file_name is_video user date likes comments',
                    populate: {
                        path: 'user',
                        model: 'User',
                        select: 'username avatar'
                    }
                })
                .limit(10)
                .sort({
                    date: -1
                })
                .exec(function(err, activities) {

                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't find like"));
                        return next(false);
                    }

                    if (activities.length == 0) {
                        res.send(404, formatter.error(null, 'activities not found'));
                        return next(false);
                    }

                    res.send(formatter.success(activities, 'get activities successfully'));
                });
        });
        next();
    },

    activityYou: function(req, res, next) {
        User.findOne({
            _id: req.authUser._id
        }, 'posts', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, 'user not found'));
                return next(false);
            }

            const posts = user.posts;

            const query = formatter.pagination({
                post: {
                    $in: posts
                }
            }, req.query.last_id, false);

            Like.find(query)
                .populate('user', 'username avatar')
                .populate({
                    path: 'post',
                    select: 'caption file_name is_video user date likes comments',
                    populate: {
                        path: 'user',
                        model: 'User',
                        select: 'username avatar'
                    }
                })
                .limit(10)
                .sort({
                    date: -1
                })
                .exec(function(err, activities) {

                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't find like"));
                        return next(false);
                    }

                    if (activities.length == 0) {
                        res.send(404, formatter.error(null, 'activities not found'));
                        return next(false);
                    }

                    res.send(formatter.success(activities, 'get activities successfully'));
                });
        });
        next();
    }
};

module.exports = LikeController;
