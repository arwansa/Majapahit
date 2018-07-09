const config = require('./config');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

let postId = '';
let commentId = '';

const CommentTest = {
    createComment: function(done) {
        chai.request(config.host)
            .post('/posts/image')
            .set('x-access-token', config.firebaseToken)
            .field('caption', '@secondUSER ac tincidunt vitae semper quis #comment')
            .attach('image', fs.readFileSync(__dirname + '/files/Screenshot.png'), 'Screenshot.png')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);

                postId = res.body.data[0]._id;

                chai.request(config.host)
                    .post('/posts/' + postId + '/comments')
                    .set('x-access-token', config.firebaseTokenSecondUser)
                    .send({
                        text: 'ac tincidunt vitae semper quis @FirstUser'
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('success');
                        res.body.success.should.equal(true);
                        done();
                        commentId = res.body.data[0]._id;
                    });
            });
    },

    readComments: function(done) {
        chai.request(config.host)
            .get('/posts/' + postId + '/comments')
            .set('x-access-token', config.firebaseToken)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    },

    updateCommentUnauthorized: function(done) {
        chai.request(config.host)
            .put('/posts/' + postId + '/comments/' + commentId)
            .set('x-access-token', config.firebaseToken)
            .send({
                text: '@firstUser ac tincidunt vitae semper quis'
            })
            .end(function(err, res) {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                done();
            });
    },

    updateComment: function(done) {
        chai.request(config.host)
            .put('/posts/' + postId + '/comments/' + commentId)
            .set('x-access-token', config.firebaseTokenSecondUser)
            .send({
                text: '@firstUser ac tincidunt vitae semper quis'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    },

    deleteCommentUnauthorized: function(done) {
        chai.request(config.host)
            .delete('/posts/' + postId + '/comments/' + commentId)
            .set('x-access-token', config.firebaseToken)
            .end(function(err, res) {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                done();
            });
    },

    deleteComment: function(done) {
        chai.request(config.host)
            .delete('/posts/' + postId + '/comments/' + commentId)
            .set('x-access-token', config.firebaseTokenSecondUser)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    }
}

module.exports = CommentTest;
