//This file takes care of all the authentication business. Nice to have separate, it makes the whole thing much cleaner.

var config      =       require('./../config.js');
var User        =       db.collection('user');

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;

var ObjectID    =   require('mongodb').ObjectID;
function getId(id) {
    return new ObjectID(id);
}

module.exports.setup = function(app) {

    /*
    The serializing method. Basically, it should return all of the user object
    that is necessary to identify it. Usually, the id field will do just fine.
     */
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    /*
    This goes the other way around. This function should return a full user object.
    This is not only database agnostic, you can also use web services or whatever here.
     */
    passport.deserializeUser(function(id, done) {
        User.findOne({_id: getId(id)}, function(err, user) {
            done(err, user);
        });
    });

    var findOrCreate = function(provider, profile, done) {

        //Look for a user already registered
        User.findOne({'auth.provider': provider, 'auth.id': profile.id}, function(err_user, user) {
            if (err_user || user) done (err_user, user);
            else {
                //Look for user not registered but selling books
                User.findOne({email_fb: profile._json.email}, function (err_email_user, email_user) {
                    if (email_user) {
                        email_user.auth = [{provider: provider, id: profile.id}];
                        email_user.username = profile._json.username;
                        email_user.first = profile._json.first_name;
                        email_user.last = profile._json.last_name;
                        User.findAndModify(
                            {email_fb: profile._json.email},
                            [],
                            email_user,
                            {},
                            function(err_updated_user, updated_user) {
                                done(err_updated_user, updated_user);
                            }

                        )
                    } else {
                        var new_user = {
                            auth: [{provider: provider, id: profile.id}],
                            username: profile._json.username,
                            first: profile._json.first_name,
                            last: profile._json.last_name,
                            email: profile._json.email
                        };
                        User.insert(new_user, {safe: true}, function(err, users) {
                            done(err, users[0]);
                        })
                    }
                });

            }
        })
    };


    passport.use(new FacebookStrategy({
        clientID: config.param('fb_id'),
        clientSecret: config.param('fb_secret'),
        callbackURL: config.param('fb_callback')
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile)
        //AM.createOrUpdateUserFromFB(profile);
            findOrCreate('facebook', profile, done);
        });
    }));

};

module.exports.routes = function(app) {
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: config.param('scope')}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));
};

module.exports.authRequired = function(req, res, next) {
    if(req.isAuthenticated()) next();
    else next('user-is-not-logged-in');
};

module.exports.logout = function(req, res) {
    req.logOut();
    res.status(200).send({status: 200});
};