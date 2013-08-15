var express     =       require('express');
var auth        =       require('./controllers/auth-manager');
var AM          =       require('./controllers/account-manager');
var IM          =       require('./controllers/item-manager');
var MM          =       require('./controllers/message-manager');
var InM         =       require('./controllers/inbound-manager');

var auth = express.basicAuth(function(user, pass, cb) {
    var User = db.collection('user');
    User.findOne({username: user}, function(err, doc) {
        if(!doc) {
            cb('No' + user + 'in the database', null);
        } else {
            doc.pass === pass ? cb(null, doc) : cb('Wrong password for ' + user, null);
        }
    });
});


module.exports = function(app) {
    app.get('/login', auth, AM.login);
    app.post('/user', AM.createNewUser);
    app.delete('/user', auth, AM.deleteUser);

    app.get('/user/items', auth, AM.getItemListForUser);

    app.post('/item', auth, IM.addItem)
    app.delete('/item', auth, IM.deleteItem);

    app.post('/message', MM.addMessageToDb)

    app.post('/inbound', InM.inboundMandrillUrl);
};