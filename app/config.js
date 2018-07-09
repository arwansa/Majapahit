const config = {
    // Mongoose MongoDB
    // e.g: mongodb://localhost/myapp
    mongoose: '[YOUR MongoDB URI]',

    // One Signal
    oneSignalKey: '[YOUR ONESIGNAL KEY]',
    oneSignalAppID: '[YOUR ONESIGNAL APP ID]',

    // Firebase
    // e.g: https://[YOUR PROJECT ID].firebaseio.com/
    firebaseDatabase: '[YOUR FIREBASE DATABASE LINK]',

    // Port
    // e.g: 8888
    portConfig: [YOUR_PORT_HERE],

    // Firebase Admin SDK File
    firebaseAdmin: '[FULLPATH/TO/Your Firebase Admin SDK File]'

}

module.exports = config;
