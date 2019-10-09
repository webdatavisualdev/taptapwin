const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const twilio = require('twilio')('', '');
const _ = require('lodash');

admin.initializeApp(functions.config().firebase);

exports.registerWithPhone = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        var code = parseInt(Math.random() * 100000);
        admin.database().ref('users').once('value', (snapshot) => {
            var users = [];
            if (snapshot.val()) {
                users = Object.keys(snapshot.val()).map((key) => {
                    return (snapshot.val())[key];
                });
            }
            var index = _.findIndex(users, u => {
                return u.phone === req.body.phone;
            });
            
            if (index < 0) {
                admin.database().ref('users').push({
                    phone: req.body.phone,
                    password: req.body.password,
                    code: code
                }).then(() => {
                    twilio.messages.create({
                        from: '+447490079717',
                        to: req.body.phone,
                        body: code
                    }).then(response => {
                        res.status(200).send({
                            success: true
                        });
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
                }).catch(() => {
                    res.status(400).send('Failed');
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Phone number already exists.'
                });
            }
        });
    });
});

exports.confirmPhoneCode = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        admin.database().ref('users').once('value', (snapshot) => {
            var users = [];

            if (snapshot.val()) {
                users = Object.keys(snapshot.val()).map((key) => {
                    return [key, (snapshot.val())[key]];
                });
            }

            var index = -1;
            var id = '';
            var user = {};
            users.map((u, i) => {
                if (u[1].phone === req.body.phone && u[1].code == req.body.code) {
                    index = i;
                    id = u[0];
                    user = u[1];
                }
            });

            if (index >= 0) {
                admin.database().ref('users/' + id).set({
                    phone: user.phone,
                    password: user.password,
                    verified: true
                }).then(() => {
                    res.status(200).send({
                        success: true
                    });
                }).catch(err => {
                    res.status(400).send(err);
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Phone number or code is not correct.'
                });
            }
        });
    });
});

exports.loginWithPhone = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        admin.database().ref('users').once('value', (snapshot) => {
            var users = [];

            if (snapshot.val()) {
                users = Object.keys(snapshot.val()).map((key) => {
                    return [key, (snapshot.val())[key]];
                });
            }

            var index = _.findIndex(users, u => {
                return u[1].phone === req.body.phone && u[1].password == req.body.password && u[1].verified;
            });

            if (index >= 0) {
                res.status(200).send({
                    success: true
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: 'Phone number or password is not correct.'
                });
            }
        });
    });
});