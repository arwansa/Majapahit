const validator = require('validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const formatter = require('../utilities/Formatter');

const CommentController = {
    create: function(req, res, next) {
        if (!req.params.pid || !validator.isMongoId(req.params.pid + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        if (!req.body.text || !validator.isLength(req.body.text + '', {
                min: 1,
                max: 500
            })) {
            res.send(400, formatter.error(null, 'text must between 1 - 500 characters'));
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

            const comment = new Comment({
                text: req.body.text,
                post: post._id,
                user: req.authUser._id
            });

            comment.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't save comment"));
                    return next(false);
                }

                res.send(formatter.success(comment, 'create comment successfully'));

                Post.update({
                    _id: post._id
                }, {
                    $push: {
                        'comments': comment._id
                    }
                }, function(err, res) {
                    console.log(err);
                });

                req.post = post;
                req.comment = comment;

                next();
            });
        });
    },

    readAll: function(req, res, next) {
        if (!req.params.pid || !validator.isMongoId(req.params.pid + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        let query = {
            post: req.params.pid
        };

        if (validator.isMongoId(req.query.last_id + '')) {
            query = {
                $and: [{
                    _id: {
                        $gt: req.query.last_id
                    }
                }, query]
            };
        }

        Comment.find(query)
            .populate('user', 'username avatar')
            .limit(10)
            .sort({
                date: 1
            })
            .exec(function(err, comments) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find comments"));
                    return next(false);
                }

                if (comments.length == 0) {
                    res.send(404, formatter.error(null, 'comments not found'));
                    return next(false);
                }

                res.send(formatter.success(comments, 'get comments successfully'));
                next();
            });
    },

    update: function(req, res, next) {
        if (!req.params.id || !req.params.pid || !validator.isMongoId(req.params.id + '') || !validator.isMongoId(req.params.pid + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        if (!req.body.text || !validator.isLength(req.body.text + '', {
                min: 1,
                max: 500
            })) {
            res.send(400, formatter.error(null, 'text must between 1 - 500 characters'));
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

            Comment.findOne({
                _id: req.params.id
            }, function(err, comment) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find comment"));
                    return next(false);
                }

                if (!comment) {
                    res.send(404, formatter.error(null, 'comment not found'));
                    return next(false);
                }

                if (!comment.user.equals(req.authUser._id)) {
                    res.send(403, formatter.error(null, 'unauthorized'));
                    return next(false);
                }

                comment.text = req.body.text;

                comment.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't save comment"));
                        return next(false);
                    }

                    res.send(formatter.success(comment, 'update comment successfully'));

                    req.post = post;
                    req.comment = comment;

                    next();
                });
            });
        });
    },

    delete: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        Comment.findOne({
            _id: req.params.id
        }, '_id user', function(err, comment) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find comment"));
                return next(false);
            }

            if (!comment) {
                res.send(404, formatter.error(null, 'comment not found'));
                return next(false);
            }

            if (!comment.user.equals(req.authUser._id)) {
                res.send(403, formatter.error(null, 'unauthorized'));
                return next(false);
            }

            req.comment = comment;

            comment.remove(function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't remove comment"));
                    return next(false);
                }

                res.send(formatter.success(null, 'delete comment successfully'));

                Post.update({
                    _id: comment.post
                }, {
                    $pull: {
                        'comments': comment._id
                    }
                }, function(err, res) {
                    console.log(err);
                });
                next();
            });
        });
    },

    deletePost: function(req, res, next) {
        Comment.remove({
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

        Comment.remove(query, function(err) {
            if (err) console.log(err);
            next();
        });
    }
};

module.exports = CommentController;
