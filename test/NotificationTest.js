const config = require('./config');
const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const NotificationTest = {
    readNotifications: function(done) {
        chai.request(config.server)
            .get('/notifications')
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

module.exports = NotificationTest;
