const config = require('./config');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

let postId = "";

const PostTest = {
    createImage: function(done) {
        chai.request(config.host)
            .post('/posts/image')
            .set('x-access-token', config.firebaseToken)
            .field('caption', 'ac tincidunt vitae semper quis @SecondUser #Image')
            .attach('image', fs.readFileSync(__dirname + '/files/Screenshot.png'), 'Screenshot.png')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    },

    createVideo: function(done) {
        chai.request(config.host)
            .post('/posts/video')
            .set('x-access-token', config.firebaseTokenSecondUser)
            .field('caption', '@seconduser ac tincidunt vitae semper quis #video')
            .attach('video', fs.readFileSync(__dirname + '/files/Screencast.mp4'), 'Screencast.mp4')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                postId = res.body.data[0]._id;
                done();
            });
    },

    readFeed: function(done) {
        chai.request(config.host)
            .get('/posts/feed')
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

    readUser: function(done) {
        chai.request(config.host)
            .get('/users/firstuser')
            .set('x-access-token', config.firebaseToken)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);

                chai.request(config.host)
                    .get('/users/' + res.body.data[0]._id + '/posts')
                    .set('x-access-token', config.firebaseToken)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('success');
                        res.body.success.should.equal(true);
                        done();
                    });
            });
    },

    searchByHashtag: function(done) {
        chai.request(config.host)
            .get('/posts')
            .query({
                hashtag: 'IMAGE'
            })
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

    readPost: function(done) {
        chai.request(config.host)
            .get('/posts/' + postId)
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

    updateCaption: function(done) {
        chai.request(config.host)
            .put('/posts/' + postId)
            .set('x-access-token', config.firebaseTokenSecondUser)
            .send({
                caption: '@firstUser ac tincidunt vitae semper quis #updateCaption #video'
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

    deletePost: function(done) {
        chai.request(config.host)
            .delete('/posts/' + postId)
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

module.exports = PostTest;
