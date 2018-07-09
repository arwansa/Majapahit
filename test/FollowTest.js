const config = require('./config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

let userId = '';

const FollowTest = {
    follow: function(done) {
        chai.request(config.host)
            .get('/users/firstuser')
            .set('x-access-token', config.firebaseTokenSecondUser)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);

                userId = res.body.data[0]._id;

                chai.request(config.host)
                    .post('/users/' + userId + '/follow')
                    .set('x-access-token', config.firebaseTokenSecondUser)
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

    followBack: function(done) {
        chai.request(config.host)
            .get('/users/seconduser')
            .set('x-access-token', config.firebaseToken)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);

                const userId = res.body.data[0]._id;

                chai.request(config.host)
                    .post('/users/' + userId + '/follow')
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

    followFailed: function(done) {
        chai.request(config.host)
            .post('/users/' + userId + '/follow')
            .set('x-access-token', config.firebaseToken)
            .end(function(err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                done();
            });
    },

    unfollow: function(done) {
        chai.request(config.host)
            .post('/users/' + userId + '/unfollow')
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

    readFollowers: function(done) {
        chai.request(config.host)
            .get('/users/' + userId + '/followers')
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

    readFollowings: function(done) {
        chai.request(config.host)
            .get('/users/' + userId + '/followings')
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

module.exports = FollowTest;
