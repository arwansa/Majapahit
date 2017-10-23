const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');
const CommentController = require('../controllers/CommentController');
const LikeController = require('../controllers/LikeController');
const FollowController = require('../controllers/FollowController');
const MediaController = require('../controllers/MediaController');
const NotificationController = require('../controllers/NotificationController');
const Authentication = require('../middleware/Authentication');

const route = function(server) {
    server.post('/auth', UserController.auth);
    server.post('/logout', Authentication, UserController.logout);

    server.post('/users/username/check', Authentication, UserController.checkUsername);
    server.put('/users/username', Authentication, UserController.updateUsername);
    server.put('/users/name', Authentication, UserController.updateName);
    server.put('/users/bio', Authentication, UserController.updateBio);
    server.put('/users/avatar', Authentication, MediaController.avatar, UserController.updateAvatar);
    server.del('/users', Authentication, UserController.delete, PostController.deleteUser, CommentController.deleteUser, LikeController.deleteUser, FollowController.deleteUser, NotificationController.deleteUser, MediaController.deleteAvatar, MediaController.deleteFileMany);

    server.get('/users/:username', Authentication, UserController.readByUsername);
    server.get('/users', Authentication, UserController.search);

    server.get('/users/:id/posts', Authentication, PostController.readUser);

    server.post('/posts/image', Authentication, UserController.mustSetUsername, MediaController.image, PostController.create, NotificationController.post);
    server.post('/posts/video', Authentication, UserController.mustSetUsername, MediaController.video, PostController.create, NotificationController.post);
    server.get('/posts', Authentication, PostController.searchByHashtag);
    server.get('/posts/feed', Authentication, PostController.readFeed);
    server.get('/posts/:id', Authentication, PostController.read);
    server.put('/posts/:id', Authentication, PostController.update, NotificationController.post);
    server.del('/posts/:id', Authentication, PostController.delete, LikeController.deletePost, CommentController.deletePost, NotificationController.deletePost, MediaController.deleteFile);

    server.post('/posts/:pid/comments', Authentication, UserController.mustSetUsername, CommentController.create, NotificationController.commentInMyPost, NotificationController.mentionInComment);
    server.get('/posts/:pid/comments', Authentication, CommentController.readAll);
    server.put('/posts/:pid/comments/:id', Authentication, CommentController.update, NotificationController.commentInMyPost, NotificationController.mentionInComment);
    server.del('/posts/:pid/comments/:id', Authentication, CommentController.delete, NotificationController.deleteComment);

    server.get('/activity', Authentication, LikeController.activity);
    server.get('/activity/you', Authentication, LikeController.activityYou);

    server.post('/posts/:pid/like', Authentication, UserController.mustSetUsername, LikeController.like, NotificationController.like);
    server.post('/posts/:pid/unlike', Authentication, LikeController.unlike, NotificationController.unlike);

    server.post('/users/:id/follow', Authentication, UserController.mustSetUsername, FollowController.follow, NotificationController.follow);
    server.post('/users/:id/unfollow', Authentication, FollowController.unfollow, NotificationController.unfollow);
    server.get('/users/:id/followers', Authentication, FollowController.readFollowers);
    server.get('/users/:id/followings', Authentication, FollowController.readFollowings);

    server.get('/notifications', Authentication, NotificationController.readAll);

    server.get('/media/:type/:file_name', MediaController.loadFile);
};

module.exports = route;
