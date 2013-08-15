var User = db.collection('user');

/**
 * With the basic Auth Middleware included with express, we can stick the
 * auth authenticated on the req.user and grab it in the request handlers.
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    res.json(req.user, 200);
};

exports.createNewUser = function(req, res) {
    var data = req.body;
    User.findOne({username: data.username}, function(err, doc) {
        if(err) throw err;
        if(!doc) {
            User.insert(data, function(err2, doc2) {
                res.status(201).json(doc2);
            });
        } else {
            res.status(409).send('Username already taken');
        }
    });
};

exports.deleteUser = function(req, res) {
    var data = req.body;
    if(!(req.user.username === data.username)) return res.status(401).send('Not authorized to delete this user');
    User.remove({username: data.username}, function(err, doc) {
        if (err) throw err;
        res.status(204).json(doc);
    })
};

exports.getItemListForUser = function(req, res) {
    console.log(req.user.username)
    User.find({"username": req.user.username}).toArray(function(err, docs) {
        console.log(err, docs)
        if (err) throw err;
        res.status(200).json(docs);
    });
}