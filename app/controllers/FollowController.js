const validator = require('validator');
const Follow = require('../models/Follow');
const User = require('../models/User');
const formatter = require('../utilities/Formatter');

const FollowController = {
    follow: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        if (req.authUser._id.equals(req.params.id)) {
            res.send(400, formatter.error(null, "can't follow this user"));
            return next(false);
        }

        User.findOne({
            _id: req.params.id
        }, '_id device', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, 'user not found'));
                return next(false);
            }

            Follow.findOne({
                follower: req.authUser._id,
                following: req.params.id
            }, function(err, followed) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find follow"));
                    return next(false);
                }

                if (!!followed) {
                    res.send(formatter.success(null, "follow successfully"));
                    return next(false);
                }

                const follow = new Follow({
                    follower: req.authUser._id,
                    following: req.params.id
                });

                follow.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't follow"));
                        return next(false);
                    }

                    res.send(formatter.success(null, 'follow successfully'));

                    User.update({
                        _id: req.authUser._id
                    }, {
                        $push: {
                            'followings': req.params.id
                        }
                    }, function(err, res) {
                        console.log(err);
                    });

                    User.update({
                        _id: req.params.id
                    }, {
                        $push: {
                            'followers': req.authUser._id
                        }
                    }, function(err, res) {
                        console.log(err);
                    });

                    req.user = user;

                    next();
                });
            });
        });
    },

    unfollow: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        if (req.authUser._id.equals(req.params.id)) {
            res.send(400, formatter.error(null, "can't unfollow this user"));
            return next(false);
        }

        User.findOne({
            _id: req.params.id
        }, '_id device', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, 'user not found'));
                return next(false);
            }

            Follow.findOne({
                follower: req.authUser._id,
                following: req.params.id
            }, function(err, follow) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find follow"));
                    return next(false);
                }

                if (!follow) {
                    res.send(formatter.success(null, 'unfollow successfully'));
                    return next(false);
                }

                req.follow = follow;

                follow.remove(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't unfollow"));
                        return next(false);
                    };
                });

                res.send(formatter.success(null, 'unfollow successfully'));

                User.update({
                    _id: req.authUser._id
                }, {
                    $pull: {
                        'followings': req.params.id
                    }
                }, function(err, res) {
                    console.log(err);
                });

                User.update({
                    _id: req.params.id
                }, {
                    $pull: {
                        'followers': req.authUser._id
                    }
                }, function(err, res) {
                    console.log(err);
                });
                next();
            });
        });
    },

    readFollowers: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        const query = formatter.pagination({
            following: req.params.id
        }, req.query.last_id, true);

        Follow.find(query)
            .select('_id follower')
            .populate('follower', 'username avatar')
            .limit(10)
            .sort({
                date: -1
            })
            .exec(function(err, followers) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find followers"));
                    return next(false);
                }

                if (followers.length == 0) {
                    res.send(404, formatter.error(null, 'followers not found'));
                    return next(false);
                }

                res.send(formatter.success(followers, 'get followers successfully'));
            });
        next();
    },

    readFollowings: function(req, res, next) {
        if (!req.params.id || !validator.isMongoId(req.params.id + '')) {
            res.send(400, formatter.error(null, 'invalid id'));
            return next(false);
        }

        const query = formatter.pagination({
            follower: req.params.id
        }, req.query.last_id, true);

        Follow.find(query)
            .select('_id following')
            .populate('following', 'username avatar')
            .limit(10)
            .sort({
                date: -1
            })
            .exec(function(err, followings) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find followings"));
                    return next(false);
                }

                if (followings.length == 0) {
                    res.send(404, formatter.error(null, 'followings not found'));
                    return next(false);
                }

                res.send(formatter.success(followings, 'get followings successfully'));
            });
        next();
    },

    deleteUser: function(req, res, next) {
        const query = {
            $or: [{
                    follower: req.authUser._id
                },
                {
                    following: req.authUser._id
                }
            ]
        };

        Follow.remove(query, function(err) {
            if (err) console.log(err);
        });

        User.update({
            _id: {
                $in: req.authUser.followers
            }
        }, {
            $pull: {
                'followings': req.authUser._id
            }
        }, function(err, res) {
            console.log(err);
        });

        User.update({
            _id: {
                $in: req.authUser.followings
            }
        }, {
            $pull: {
                'followers': req.authUser._id
            }
        }, function(err, res) {
            console.log(err);
        });

        next();
    }
};

module.exports = FollowController;
