var express     =       require('express');
var auth        =       require('./controllers/auth-manager');
var AM          =       require('./controllers/account-manager');
var IM          =       require('./controllers/item-manager');
var MM          =       require('./controllers/message-manager');
var GM          =       require('./controllers/group-manager')

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
    app.get('/autologin', AM.autologin);
    app.post('/login', AM.login);
    app.post('/user', AM.createNewUser);
    app.delete('/user', auth, AM.deleteUser);

    app.get('/user/items', auth, AM.getItemListForUser);


    app.get('/items', IM.getGroupList);
    app.get('/item/:ref', IM.getItem);
    app.post('/item', auth, IM.addItem);
    app.delete('/item', auth, IM.deleteItem);

    app.get('/groups', GM.getGroups);

    app.post('/message', MM.sendMessageViaMandrill);

    app.post('/inbound', MM.inboundMessage)
};