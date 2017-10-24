const twitter = require('twitter-text');
const validator = require('validator');
const Post = require('../models/Post');
const User = require('../models/User');
const formatter = require('../utilities/Formatter');

const PostController = {
    create: function(req, res, next) {
        const extractHashtags = twitter.extractHashtags(req.body.caption).toLocaleString().toLowerCase();

        const post = new Post({
            file_name: req.body.file_name,
            is_video: req.body.is_video,
            caption: req.body.caption,
            user: req.authUser._id,
            hashtags: extractHashtags.length > 0 ? extractHashtags.split(',') : []
        });
        post.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't save post"));
                return next(false);
            }

            res.send(formatter.success(post, 'create post successfully'));

            User.update({
                _id: req.authUser._id
            }, {
                $push: {
                    'posts': post._id
                }
            }, function(err, res) {
                console.log(err);
            });

            req.post = post;

            next();
        });
    },

    readFeed: function(req, res, next) {
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

            let feed = user.followings;
            feed.push(user._id);

            const query = formatter.pagination({
                user: {
                    $in: feed
                }
            }, req.query.last_id, false);

            Post.find(query)
                .populate('user', 'username avatar')
                .limit(10)
                .sort({
                    date: -1
                })
                .exec(function(err, posts) {

                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't find posts"));
                        return next(false);
                    }

                    if (posts.length == 0) {
                        res.send(404, formatter.error(null, 'posts not found'));
                        return next(false);
                    }

                    res.send(formatter.success(posts, 'get all posts successfully'));
                });
        });
        next();
    },

    readUser: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        const query = formatter.pagination({
            user: req.params.id
        }, req.query.last_id, false);

        Post.find(query)
            .populate('user', 'username avatar')
            .limit(10)
            .sort({
                date: -1
            })
            .exec(function(err, posts) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find post"));
                    return next(false);
                }

                if (posts.length == 0) {
                    res.send(404, formatter.error(null, 'posts not found'));
                    return next(false);
                }

                res.send(formatter.success(posts, 'get user posts successfully'));
            });
        next();
    },

    read: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        Post.findOne({
                _id: req.params.id
            })
            .populate('user', 'username avatar')
            .exec(function(err, post) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find post"));
                    return next(false);
                }

                if (!post) {
                    res.send(404, formatter.error(null, 'post not found'));
                    return next(false);
                }

                res.send(formatter.success(post, 'get post successfully'));
            });
        next();
    },

    searchByHashtag: function(req, res, next) {
        if (!req.query.hashtag || !validator.isLength(req.query.hashtag + '', {
                min: 1,
                max: 50
            })) {
            res.send(400, formatter.error(null, 'hashtag must between 1 - 50 characters'));
            return next(false);
        }

        if (!twitter.isValidHashtag('#' + req.query.hashtag)) {
            res.send(400, formatter.error(null, 'invalid hashtag'));
            return next(false);
        }

        const hashtag = req.query.hashtag.toLowerCase();

        const query = formatter.pagination({
            hashtags: {
                $elemMatch: {
                    $in: [hashtag]
                }
            }
        }, req.query.last_id, false);

        Post.find(query)
            .populate('user', 'username avatar')
            .limit(10)
            .sort({
                date: -1
            })
            .exec(function(err, posts) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find posts"));
                    return next(false);
                }

                if (posts.length == 0) {
                    res.send(404, formatter.error(null, 'posts not found'));
                    return next(false);
                }

                res.send(formatter.success(posts, 'search posts successfully'));
                next();
            });
    },

    update: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        if (!req.body.caption) {
            req.body.caption = '';
        }

        if (req.body.caption.length > 500) {
            res.send(400, formatter.error(null, 'caption max 500 characters'));
            return next(false);
        }

        Post.findOne({
            _id: req.params.id
        }, function(err, post) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find post"));
                return next(false);
            }

            if (!post) {
                res.send(404, formatter.error(null, 'post not found'));
                return next(false);
            }

            if (!post.user.equals(req.authUser._id)) {
                res.send(403, formatter.error(null, 'unauthorized'));
                return next(false);
            }

            const extractHashtags = twitter.extractHashtags(req.body.caption).toLocaleString().toLowerCase();

            post.caption = req.body.caption;
            post.hashtags = extractHashtags.length > 0 ? extractHashtags.split(',') : [];

            post.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't save post"));
                    return next(false);
                }

                res.send(formatter.success(post, 'update post successfully'));

                req.post = post;

                next();
            });
        });
    },

    delete: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        Post.findOne({
            _id: req.params.id
        }, 'user is_video file_name', function(err, post) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find post"));
                return next(false);
            }

            if (!post) {
                res.send(404, formatter.error(null, 'post not found'));
                return next(false);
            }

            if (!post.user.equals(req.authUser._id)) {
                res.send(403, formatter.error(null, 'unauthorized'));
                return next(false);
            }

            req.post = post;

            post.remove(function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't remove post"));
                    return next(false);
                }

                res.send(formatter.success(null, 'delete post successfully'));

                User.update({
                    _id: req.authUser._id
                }, {
                    $pull: {
                        'posts': post._id
                    }
                }, function(err, res) {
                    console.log(err);
                });
                next();
            });
        });
    },

    deleteUser: function(req, res, next) {
        Post.find({
            _id: {
                $in: req.authUser.posts
            }
        }, 'user is_video file_name', function(err, posts) {
            if (err) console.log(err);

            req.posts = posts;

            Post.remove({
                _id: {
                    $in: req.authUser.posts
                }
            }, function(err) {
                if (err) console.log(err);
                next();
            });
        });
    }
};

module.exports = PostController;
