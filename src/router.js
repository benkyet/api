var express     =       require('express');
var passport = require('passport');
var auth        =       require('./controllers/auth-manager');
var AM          =       require('./controllers/account-manager');
var IM          =       require('./controllers/item-manager');
var MM          =       require('./controllers/message-manager');
var GM          =       require('./controllers/group-manager');

var config = require('./../config.js');

var auth = AM.isLoggedInMiddleware;

//    function(req, res, next) {
//    express.basicAuth(function(user, pass, cb) {
//        var User = db.collection('user');
//        User.findOne({username: user}, function(err, doc) {
//            if(!doc) {
//                res.status(401).json({reason: 'Sorry, this username was not found', status: 401});
//            } else {
//                doc.pass === pass ?
//                    cb(null, doc) :
//                    res.status(401).json({reason: 'Wrong password', status: 401});
//            }
//        });
//    })(req, res, next);
//}

module.exports = function(app) {

    //require passport module and fb plugin
    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook').Strategy;



//Configure fb-passport login
    passport.use(new FacebookStrategy({
        clientID: config.param('fb_id'),
        clientSecret: config.param('fb_secret'),
        callbackURL: config.param('fb_callback')
    }, function(accessToken, refreshToken, profile, done) {
//        process.nextTick(function () {
            console.log(profile)
            //AM.createOrUpdateUserFromFB(profile);
//        });


    }));

    //facebook auth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.get('/autologin', AM.autologin);
    app.post('/login', AM.login);
    app.del('/logout', AM.logout);
    app.post('/user', AM.createNewUser);
    app.put('/user', auth, AM.updateUser);
    app.delete('/user', auth, AM.deleteUser);
    app.get('/user/items', auth, AM.userItems);


    app.get('/items', IM.getGroupList);
    app.get('/item/:ref', IM.getItem);
    app.post('/item', auth, IM.addItem);
    app.put('/item', auth, IM.updateItem);
    app.delete('/item/:ref', auth, IM.deleteItem);

    app.get('/groups', GM.getGroups);
    app.get('/events/:group', GM.getEventsForGroup);

    app.post('/message', MM.sendMessageViaMandrill);


    //Useful when configuring Mandrill
    //Uncomment for testing
//    app.post('/inbound', function(req, res) {
//        res.status(200).send('ok')
//    })
    app.post('/inbound', MM.inboundMessage)
};