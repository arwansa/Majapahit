const config = require('./config');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const UserTest = {
    authFailed: function(done) {
        chai.request(config.server)
            .post('/auth')
            .send({
                token: 'asdasd',
                device: config.device
            })
            .end(function(err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                done();
            });
    },

    authRegister: function(done) {
        chai.request(config.server)
            .post('/auth')
            .send({
                token: config.firebaseToken,
                device: config.device
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                res.body.message.should.equal('register successfully');
                done();
            });
    },

    authRegisterSecondUser: function(done) {
        chai.request(config.server)
            .post('/auth')
            .send({
                token: config.firebaseTokenSecondUser,
                device: config.deviceSecondUser
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                res.body.message.should.equal('register successfully');
                done();
            });
    },

    authLogin: function(done) {
        chai.request(config.server)
            .post('/auth')
            .send({
                token: config.firebaseToken,
                device: config.device
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                res.body.message.should.equal('login successfully');
                done();
            });
    },

    updateUsername: function(done) {
        chai.request(config.server)
            .put('/users/username')
            .set('x-access-token', config.firebaseToken)
            .send({
                username: 'firstUser'
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

    updateUsernameSecondUser: function(done) {
        chai.request(config.server)
            .put('/users/username')
            .set('x-access-token', config.firebaseTokenSecondUser)
            .send({
                username: 'seconduser'
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

    updateUsernameFailed: function(done) {
        chai.request(config.server)
            .put('/users/username')
            .set('x-access-token', config.firebaseToken)
            .send({
                username: 'first user'
            })
            .end(function(err, res) {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.message.should.equal('invalid username');
                done();
            });
    },

    updateName: function(done) {
        chai.request(config.server)
            .put('/users/name')
            .set('x-access-token', config.firebaseToken)
            .send({
                name: 'First User Name'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done()
            });
    },

    updateBio: function(done) {
        chai.request(config.server)
            .put('/users/bio')
            .set('x-access-token', config.firebaseToken)
            .send({
                bio: 'ac tincidunt vitae semper quis'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done()
            });
    },

    updateAvatar: function(done) {
        chai.request(config.server)
            .put('/users/avatar')
            .set('x-access-token', config.firebaseToken)
            .attach('avatar', fs.readFileSync(__dirname + '/files/Screenshot.png'), 'Screenshot.png')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(true);
                done();
            });
    },

    readByUsername: function(done) {
        chai.request(config.server)
            .get('/users/firstUser')
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

    usernameAvailable: function(done) {
        chai.request(config.server)
            .post('/users/username/check')
            .set('x-access-token', config.firebaseToken)
            .send({
                username: 'thirduser'
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

    searchUser: function(done) {
        chai.request(config.server)
            .get('/users')
            .query({
                search_key: 'FirstUser'
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

    logout: function(done) {
        chai.request(config.server)
            .post('/logout')
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

    deleteUser: function(done) {
        chai.request(config.server)
            .delete('/users')
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

    deleteSecondUser: function(done) {
        chai.request(config.server)
            .delete('/users')
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

module.exports = UserTest;
