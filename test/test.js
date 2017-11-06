const UserTest = require('./UserTest');
const PostTest = require('./PostTest');
const CommentTest = require('./CommentTest');
const LikeTest = require('./LikeTest');
const FollowTest = require('./FollowTest');
const NotificationTest = require('./NotificationTest');

describe('USER', function() {
    it('should failed login or register /auth POST', UserTest.authFailed);
    it('should register /auth POST', UserTest.authRegister);
    it('should register second user /auth POST', UserTest.authRegisterSecondUser);
    it('should login /auth POST', UserTest.authLogin);
    it('should update username /users/username PUT', UserTest.updateUsername);
    it('should update username second user /users/username PUT', UserTest.updateUsernameSecondUser);
    it('should invalid username /users/username PUT', UserTest.updateUsernameFailed);
    it('should update name /users/name PUT', UserTest.updateName);
    it('should update bio /users/bio PUT', UserTest.updateBio);
    it('should update avatar /users/avatar PUT', UserTest.updateAvatar);
    it('should get user profile /users/:username GET', UserTest.readByUsername);
    it('should username available /users/username/check POST', UserTest.usernameAvailable);
    it('should search users by name or username /users GET', UserTest.searchUser);
});

describe('FOLLOW', function() {
    it('should follow /users/:id/follow POST', FollowTest.follow);
    it('should follow back /users/:id/follow POST', FollowTest.followBack);
    it('should read followers /users/:id/followers GET', FollowTest.readFollowers);
    it('should read followings /users/:id/followings GET', FollowTest.readFollowings);
    it('should failed follow if same user /users/:id/follow POST', FollowTest.followFailed);
    it('should unfollow /users/:id/unfollow POST', FollowTest.unfollow);
});

describe('POST', function() {
    it('should create image post /posts/image POST', PostTest.createImage);
    it('should create video post /posts/video POST', PostTest.createVideo);
    it('should read feed /posts/feed GET', PostTest.readFeed);
    it('should read posts by user id /users/:id/posts GET', PostTest.readUser);
    it('should search posts by hashtag /posts GET', PostTest.searchByHashtag);
    it('should read post /posts/:id GET', PostTest.readPost);
    it('should update caption /posts/:id PUT', PostTest.updateCaption);
    it('should delete post /posts/:id DELETE', PostTest.deletePost);
});

describe('COMMENT', function() {
    it('should create comment /posts/:pid/comments POST', CommentTest.createComment);
    it('should read comments by post /posts/:pid/comments GET', CommentTest.readComments);
    it('should unauthorized update comment /posts/:pid/comments/:id PUT', CommentTest.updateCommentUnauthorized);
    it('should update comment /posts/:pid/comments/:id PUT', CommentTest.updateComment);
    it('should unauthorized delete comment /posts/:pid/comments/:id DELETE', CommentTest.deleteCommentUnauthorized);
    it('should delete comment /posts/:pid/comments/:id DELETE', CommentTest.deleteComment);
});

describe('LIKE', function() {
    it('should like post /posts/:pid/like POST', LikeTest.like);
    it('should like post from other user /posts/:pid/like POST', LikeTest.likeFromOtherUser);
    it('should read activity /activity GET', LikeTest.activity);
    it('should read my activity /activity/you GET', LikeTest.activityYou);
    it('should read likes /posts/:pid/likes GET', LikeTest.readLikes);
    it('should unlike post /posts/:pid/unlike POST', LikeTest.unlike);
});

describe('NOTIFICATION', function() {
    it('should read notifications /notifications GET', NotificationTest.readNotifications);
});

describe('LOGOUT', function() {
    it('should logout /logout POST', UserTest.logout);
});

describe('DELETE', function() {
    it('should delete user /users DELETE', UserTest.deleteUser);
    it('should delete second user /users DELETE', UserTest.deleteSecondUser);
});
