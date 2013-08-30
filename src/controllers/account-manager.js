var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var User = db.collection('user');
var Session = db.collection('session');

/**
 * With the basic Auth Middleware included with express, we can stick the
 * auth authenticated on the req.user and grab it in the request handlers.
 * @param req
 * @param res
 */
//exports.login = function (req, res) {
//    res.json(req.user, 200);
//};

exports.isLoggedInMiddleware = function(req, res, next) {
    if(!req.headers['token']) {
        next('please-provide-a-token-in-the-headers-of-your-requests');
        return
    };
    Session.findOne({session_id: req.headers['token']}, function(err, doc) {
        req.user = doc;
        next();
    });
};

exports.autologin = function(req, res) {
//    console.log('autologin')
    Session.findOne({session_id: req.headers['token']}, function(err, doc) {

        if(!doc) {

            res.status(401).json({status: 401, reason: 'Token not found'})

        } else {

            User.findOne({username: doc.username}, function(err_u, user){
                var response = {
                    status: 200,
                    user: user
                };

                res.status(200).json(response);
            });


        }
    })
};

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
                    'username': doc.username,
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
        }
    })
}





exports.deleteUser = function(req, res) {
    var data = req.body;
    if(!(req.user.username === data.username)) return res.status(401).send('Not authorized to delete this user');
    User.remove({username: data.username}, function(err, doc) {
        if (err) throw err;
        res.status(204).json(doc);
    });
};

exports.getItemListForUser = function(req, res) {
    User.find({"username": req.user.username}).toArray(function(err, docs) {
        if (err) throw err;
        res.status(200).json(docs);
    });
};