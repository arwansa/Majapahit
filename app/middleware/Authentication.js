const firebaseAdmin = require("firebase-admin");
const User = require('../models/User');
const formatter = require('../utilities/Formatter');

module.exports = function(req, res, next) {
    if (!req.headers['x-access-token']) {
        res.send(401, formatter.error(null, 'must logged in'));
        return next(false);
    }

    firebaseAdmin.auth().verifyIdToken(req.headers['x-access-token']).then(function(decodedToken) {
        const uid = decodedToken.uid;
        User.findOne({
            firebase_uid: uid
        }, '_id username name avatar bio device', function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, formatter.error(null, "can't find user"));
                return next(false);
            }

            if (!user) {
                res.send(401, formatter.error(null, 'user not registered'));
                return next(false);
            }

            req.authUser = user;
            next();
        });
    }).catch(function(error) {
        console.log(error);
        res.send(401, formatter.error(null, 'invalid token'));
        next(false);
    });
}
