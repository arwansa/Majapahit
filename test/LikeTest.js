const config = require('./config');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

let postId = '';

const LikeTest = {
    like: function(done) {
        chai.request(config.server)
            .post('/posts/image')
            .set('x-access-token', config.firebaseToken)
            .field('caption', '@SecondUser @firstuser ac tincidunt vitae semper quis #BLUES #music')
            .attach('image', fs.readFileSync(__dirname + '/files/Screenshot.png'), 'Screenshot.png')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);

                postId = res.body.data[0]._id;

                chai.request(config.server)
                    .post('/posts/' + postId + '/like')
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

    likeFromOtherUser: function(done) {
        chai.request(config.server)
            .post('/posts/' + postId + '/like')
            .set('x-access-token', config.firebaseTokenSecondUser)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    },

    unlike: function(done) {
        chai.request(config.server)
            .post('/posts/' + postId + '/unlike')
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

    activity: function(done) {
        chai.request(config.server)
            .get('/activity')
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

    activityYou: function(done) {
        chai.request(config.server)
            .get('/activity/you')
            .set('x-access-token', config.firebaseToken)
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

module.exports = LikeTest;
