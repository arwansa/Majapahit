const fs = require('fs');
const im = require('imagemagick');
const formatter = require('../utilities/Formatter');

const MediaController = {
    avatar: function(req, res, next) {
        if (!req.files.avatar) {
            res.send(400, formatter.error(null, 'avatar required'));
            return next(false);
        }

        const avatar = req.files.avatar;

        if (avatar.type != 'image/jpeg' && avatar.type != 'image/png') {
            res.send(400, formatter.error(null, 'invalid avatar format'));
            return next(false);
        }

        if (avatar.size > (5 * (1024 * 1024))) {
            res.send(400, formatter.error(null, 'avatar size is too large'));
            return next(false);
        }

        im.identify(avatar.path, function(err, features) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't identify avatar"));
                return next(false);
            }

            if (features.format != 'JPEG' && features.format != 'PNG') {
                res.send(400, formatter.error(null, 'invalid avatar format'));
                return next(false);
            }

            fs.readFile(avatar.path, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't read avatar"));
                    return next(false);
                }

                const fileName = req.authUser._id + new Date().getTime().toString() + '.jpg';
                const filePath = __dirname + '/../uploads/avatars/' + fileName;

                im.resize({
                    srcData: data,
                    width: 256
                }, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't resize avatar"));
                        return next(false);
                    }

                    fs.writeFileSync(filePath, stdout, 'binary');

                    if (req.authUser.avatar) {
                        fs.unlinkSync(__dirname + '/../uploads/avatars/' + req.authUser.avatar);
                    }

                    req.authUser.avatar = fileName;
                    next();
                });
            });
        });
    },

    image: function(req, res, next) {
        if (!req.files.image) {
            res.send(400, formatter.error(null, 'image required'));
            return next(false);
        }

        if (!req.body.caption) {
            req.body.caption = '';
        }

        if (req.body.caption.length > 500) {
            res.send(400, formatter.error(null, 'caption max 500 characters'));
            return next(false);
        }

        const image = req.files.image;

        if (image.type != 'image/jpeg' && image.type != 'image/png') {
            res.send(400, formatter.error(null, 'invalid image format'));
            return next(false);
        }

        if (image.size > (5 * (1024 * 1024))) {
            res.send(400, formatter.error(null, 'image size is too large'));
            return next(false);
        }

        im.identify(image.path, function(err, features) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't identify image"));
                return next(false);
            }

            if (features.format != 'JPEG' && features.format != 'PNG') {
                res.send(400, formatter.error(null, 'invalid image format'));
                return next(false);
            }

            fs.readFile(image.path, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't read image"));
                    return next(false);
                }

                const fileName = Date.now() + req.authUser._id + '.jpg';
                const filePath = __dirname + '/../uploads/posts/images/' + fileName;

                im.resize({
                    srcData: data,
                    width: 512
                }, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                        res.send(500, formatter.error(null, "can't resize image"));
                        return next(false);
                    }

                    fs.writeFileSync(filePath, stdout, 'binary');

                    req.body.file_name = fileName;
                    req.body.is_video = false;
                    next();
                });
            });
        });
    },

    video: function(req, res, next) {
        if (!req.files.video) {
            res.send(400, formatter.error(null, 'video required'));
            return next(false);
        }

        if (!req.body.caption) {
            req.body.caption = '';
        }

        if (req.body.caption.length > 500) {
            res.send(400, formatter.error(null, 'caption max 500 characters'));
            return next(false);
        }

        const video = req.files.video;

        if (video.type != 'video/mp4') {
            res.send(400, formatter.error(null, 'invalid video format'));
            return next(false);
        }

        if (video.size > (10 * (1024 * 1024))) {
            res.send(400, formatter.error(null, 'video size is too large'));
            return next(false);
        }

        fs.readFile(video.path, function(err, data) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't identify video"));
                return next(false);
            }

            const fileName = Date.now() + req.authUser._id + '.mp4';
            const filePath = __dirname + "/../uploads/posts/videos/" + fileName;

            fs.writeFile(filePath, data, function(err) {
                if (err) {
                    console.log(err);
                    res.send(500, formatter.error(null, "can't save video"));
                    return next(false);
                }

                req.body.file_name = fileName;
                req.body.is_video = true;
                next();
            });
        });
    },

    deleteAvatar: function(req, res, next) {
        if (!req.authUser.avatar) {
            console.log("Avatar doesn't exists");
            return next();
        }

        fs.unlinkSync(__dirname + '/../uploads/avatars/' + req.authUser.avatar);
        next();
    },

    deleteFile: function(req, res, next) {
        const fileType = req.post.is_video ? 'videos' : 'images';
        fs.unlinkSync(__dirname + '/../uploads/posts/' + fileType + '/' + req.post.file_name);
        next();
    },

    deleteFileMany: function(req, res, next) {
        if (!req.posts) return next();
        for (let i = 0; i < req.posts.length; i++) {
            const fileType = req.posts[i].is_video ? 'videos' : 'images';
            fs.unlinkSync(__dirname + '/../uploads/posts/' + fileType + '/' + req.posts[i].file_name);
        }
        next();
    },

    loadFile: function(req, res, next) {
        if (!req.params.type) {
            res.send(400, formatter.error(null, "Type required"));
            return next(false);
        }

        let dir = __dirname + '/../uploads/';

        if (req.params.type == 'avatars') {
            dir = dir + 'avatars/' + req.params.file_name;
        } else {
            dir = dir + 'posts/' + req.params.type + '/' + req.params.file_name;
        }

        fs.readFile(dir, function(err, file) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "Can't find file"));
                return next(false);
            }
            res.write(file);
            res.end();
            next();
        });
    }
};

module.exports = MediaController;
