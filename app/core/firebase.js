const firebaseAdmin = require("firebase-admin");
const config = require('../config');
const firebaseServiceAccount = require(config.firebaseAdmin);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
    databaseURL: config.firebaseDatabase
});