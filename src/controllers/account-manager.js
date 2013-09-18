var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var User = db.collection('user');
var Session = db.collection('session');
var Item = db.collection('item');

var ObjectID    =   require('mongodb').ObjectID;
function getId(id) {
    return new ObjectID(id);
}

//exports.isLoggedInMiddleware = function(req, res, next) {
//    if(!req.headers['token']) {
//        next('please-provide-a-token-in-the-headers-of-your-requests');
//        return
//    };
//    Session.findOne({session_id: req.headers['token']}, function(err, doc) {
//        req.user = doc;
//        next();
//    });
//};

exports.autologin = function(req, res) {
//    console.log('autologin')
    Session.findOne({session_id: req.headers['token']}, function(err, doc) {

        if(!doc) {

            res.status(401).json({status: 401, reason: 'Token not found'})

        } else {

            User.findOne({_id: getId(doc.user_id.toString())}, function(err_u, user){
                var response = {
                    status: 200,
                    user: user
                };

                res.status(200).json(response);
            });
        }
    })
};

exports.createOrUpdateUserFromFB = function(profile) {
    var user = {
        username: profile.username,
        email: profile._json.email,
        fb_user: true

    }
    User.findAndModify(
        {username: profile.username},
        [],
        user,
        {new: true},
        function(err, doc) {
            // Generate session id
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

            // Create session document
            var session = {
                'session_id': session_id,
                'user_id': doc._id
            }

            // Insert session document
            Session.insert(session, function (err2, result) {
                if(err2) throw err2;
                var response = {
                    status: 200,
                    token: result[0].session_id,
                    user: doc
                };


            });
        }
    )
}

exports.login = function(req, res) {
    var data = req.body;

    User.findOne({username: data.username}, function(err, doc) {
        if (err) throw err;

        if (doc) {

            if (bcrypt.compareSync(data.pass, doc.pass)) {

                // Generate session id
                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                // Create session document
                var session = {
                    'session_id': session_id,
                    'user_id': doc._id
                }

                // Insert session document
                Session.insert(session, function (err2, result) {
                    if(err2) throw err2;
                    var response = {
                        status: 200,
                        token: result[0].session_id,
                        user: doc
                    };
                    res.status(200).json(response);
                });

            } else {
                res.status(401).json({status: 401, reason: "Wrong password"})
            }

        }
        else {
            res.status(401).json({status: 401, reason: "Sorry, this username was not found"})
        }
    })
};

exports.logout = function(req, res) {
    var data = req.body;

    Session.remove({session_id: req.headers['token']}, function(err, doc) {
        if(!doc) {

            res.status(401).json({status: 401, reason: 'Token not found'})

        } else {

            res.status(200).json({status: 200});


        }
    })
};


exports.userItems = function(req, res) {

    Item.find(
        {seller_id: getId(req.user.user_id.toString())}
    ).toArray(function(err, docs) {
            var response = {
                status: 200,
                items: docs
            }
            res.status(200).json(response);
        })
}

exports.createNewUser = function(req, res) {
    var data = req.body;

    User.findOne({username: data.username}, function(err, doc) {
        if (err) throw err;
        if(!doc) {

            var salt = bcrypt.genSaltSync();
            var password_hash = bcrypt.hashSync(data.pass, salt);

            data.pass = password_hash;

            User.insert(data, function(err2, doc2) {
                var response = {
                    status: 201,
                    user: doc2[0]
                };
                res.status(201).json(response)
            })


        } else {
            var response = {
                status: 409,
                reason: 'Username already taken'
            };
            res.status(409).json(response);
        };
    });
};

exports.updateUser = function(req, res) {
    var data = req.body;

    var salt = bcrypt.genSaltSync();
    var password_hash = bcrypt.hashSync(data.pass, salt);

    data.pass = password_hash

    User.findAndModify(
        {_id: getId(req.user.user_id.toString())},
        [],
        data,
        {new: true},
        function(err, doc) {
            var response = {
                status: 200,
                user: doc
            }
            res.status(200).send(response);
        }
    )
};

exports.deleteUser = function(req, res) {
    var data = req.body;
    User.remove({_id: getId(req.user.user_id.toString())}, function(err, doc) {
        if (err) throw err;
        res.status(204).json(doc);
    });
};