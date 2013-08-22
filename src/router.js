var express     =       require('express');
var auth        =       require('./controllers/auth-manager');
var AM          =       require('./controllers/account-manager');
var IM          =       require('./controllers/item-manager');
var MM          =       require('./controllers/message-manager');
var InM         =       require('./controllers/inbound-manager');

var auth = function(req, res, next) {
    express.basicAuth(function(user, pass, cb) {
        var User = db.collection('user');
        User.findOne({username: user}, function(err, doc) {
            if(!doc) {
                res.status(401).json({reason: 'Sorry, this username was not found', status: 401});
            } else {
                doc.pass === pass ?
                    cb(null, doc) :
                    res.status(401).json({reason: 'Wrong password', status: 401});
            }
        });
    })(req, res, next);
}






module.exports = function(app) {
    app.get('/login', auth, AM.login);
    app.post('/user', AM.createNewUser);
    app.delete('/user', auth, AM.deleteUser);

    app.get('/user/items', auth, AM.getItemListForUser);


    app.get('/items', IM.getGroupList);
    app.get('/item/:ref', IM.getItem);
    app.post('/item', auth, IM.addItem);
    app.delete('/item', auth, IM.deleteItem);

    app.post('/message', MM.addMessageToDb);

    app.post('/inbound', MM.inboundMessage);
};