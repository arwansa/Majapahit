const twitter = require('twitter-text');
const validator = require('validator');
const firebaseAdmin = require("firebase-admin");
const User = require('../models/User');
const config = require('../config');
const formatter = require('../utilities/Formatter');
const firebaseServiceAccount = require('[PATH/TO/serviceAccountKey.json]');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    databaseURL: config.firebaseDatabase
});

const UserController = {
    auth: function(req, res, next) {
        if (!req.body.token || !req.body.device) {
            res.send(400, formatter.error(null, 'token and device required'));
            return next(false);
        }

        firebaseAdmin.auth().verifyIdToken(req.body.token).then(function(decodedToken) {
            const uid = decodedToken.uid;
            User.findOne({
                firebase_uid: uid
            }, function(err, user) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find user"));
                    return next(false);
                }

                if (!user) {
                    const user = new User({
                        firebase_uid: uid,
                        device: req.body.device
                    });

                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                            res.send(500, formatter.error(null, "can't save user"));
                            return next(false);
                        }

                        res.send(formatter.success(user, 'register successfully'));
                    });

                    return next();
                }

                user.device = req.body.device;

                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't save user"));
                        return next(false);
                    }

                    res.send(formatter.success(user, 'login successfully'));
                });

                next();
            });
        }).catch(function(error) {
            console.log(error);
            res.send(400, formatter.error(null, 'invalid token'));
            next(false);
        });
    },

    search: function(req, res, next) {
        if (!req.query.search_key || !validator.isLength(req.query.search_key + '', {
                min: 3,
                max: 50
            })) {
            res.send(400, formatter.error(null, 'search_key must between 3 - 50 characters'));
            return next(false);
        }

        let query = {
            $or: [{
                    username: {
                        $regex: new RegExp(req.query.search_key, 'i')
                    }
                },
                {
                    name: {
                        $regex: new RegExp(req.query.search_key, 'i')
                    }
                }
            ]
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

        User.find(query)
            .select('_id avatar username name')
            .limit(10)
            .sort({
                username: 1
            })
            .exec(function(err, users) {

                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't find user"));
                    return next(false);
                }

                if (users.length == 0) {
                    res.send(404, formatter.error(null, 'user not found'));
                    return next(false);
                }

                res.send(formatter.success(users, 'search users successfully'));
                next();
            });
    },

    readByUsername: function(req, res, next) {
        if (!req.params.username || !validator.isLength(req.params.username + '', {
                min: 3,
                max: 50
            })) {
            res.send(400, formatter.error(null, 'username must between 3 - 50 characters'));
            return next(false);
        }

        User.findOne({
            username: req.params.username.toLowerCase()
        }, function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, 'user not found'));
                return next(false);
            }

            res.send(formatter.success(user, 'read profile successfully'));
        });
        next();
    },

    mustSetUsername: function(req, res, next) {
        if (!req.authUser.username) {
            res.send(400, formatter.error(null, 'must set username'));
            return next(false);
        }
        next();
    },

    checkUsername: function(req, res, next) {
        if (!req.body.username || !validator.isLength(req.body.username + '', {
                min: 3,
                max: 50
            })) {
            res.send(400, formatter.error(null, 'username must between 3 - 50 characters'));
            return next(false);
        }

        const username = req.body.username.toLowerCase();

        if (!twitter.isValidUsername('@' + username)) {
            res.send(400, formatter.error(null, 'invalid username'));
            return next(false);
        }

        User.findOne({
            username: username
        }, '_id', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!!user && !user._id.equals(req.authUser._id)) {
                res.send(400, formatter.error(null, 'username has been used'));
                return next(false);
            }

            res.send(formatter.success(null, "username available"));

            next();
        });
    },

    updateUsername: function(req, res, next) {
        if (!req.body.username || !validator.isLength(req.body.username + '', {
                min: 3,
                max: 50
            })) {
            res.send(400, formatter.error(null, 'username must between 3 - 50 characters'));
            return next(false);
        }

        const username = req.body.username.toLowerCase();

        if (!twitter.isValidUsername('@' + username)) {
            res.send(400, formatter.error(null, 'invalid username'));
            return next(false);
        }

        if (validator.equals(username + '', req.authUser.username + '')) {
            res.send(formatter.success(req.authUser, 'update username successfully'));
            return next(false);
        }

        User.findOne({
            username: username
        }, '_id', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!!user && !user._id.equals(req.authUser._id)) {
                res.send(400, formatter.error(null, 'username has been used'));
                return next(false);
            }

            req.authUser.username = username;

            req.authUser.save(function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't save username"));
                    return next(false);
                }

                res.send(formatter.success(req.authUser, 'update username successfully'));
                next();
            });
        });
    },

    updateAvatar: function(req, res, next) {
        req.authUser.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't save avatar"));
                return next(false);
            }

            res.send(formatter.success(req.authUser, 'update avatar successfully'));
            next();
        });
    },

    updateName: function(req, res, next) {
        if (!req.body.name) {
            req.body.name = '';
        }

        if (req.body.name.length > 50) {
            res.send(400, formatter.error(null, 'name max 50 characters'));
            return next(false);
        }

        req.authUser.name = req.body.name;

        req.authUser.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't save name"));
                return next(false);
            }

            res.send(formatter.success(req.authUser, 'update name successfully'));
            next();
        });
    },

    updateBio: function(req, res, next) {
        if (!req.body.bio) {
            req.body.bio = '';
        }

        if (req.body.bio.length > 500) {
            res.send(400, formatter.error(null, 'bio max 500 characters'));
            return next(false);
        }

        req.authUser.bio = req.body.bio;

        req.authUser.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't save bio"));
                return next(false);
            }

            res.send(formatter.success(req.authUser, 'update bio successfully'));
            next();
        });
    },

    logout: function(req, res, next) {
        req.authUser.device = '';
        req.authUser.save(function(err) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't logout"));
                return next(false);
            }
            res.send(formatter.success(req.authUser, 'logout successfully'));
            next();
        });
    },

    delete: function(req, res, next) {
        User.findOne({
            _id: req.authUser._id
        }, "posts followers followings", function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(404, formatter.error(null, "user not found"));
                return next(false);
            }

            req.authUser.posts = user.posts;
            req.authUser.followers = user.followers;
            req.authUser.followings = user.followings;

            User.remove({
                _id: req.authUser._id
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't delete user"));
                    return next();
                }
                res.send(formatter.success(null, 'delete user successfully'));
                next();
            });
        });
    }
};

module.exports = UserController;
