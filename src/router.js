var express     =       require('express');
var auth        =       require('./controllers/auth-manager');
var AM          =       require('./controllers/account-manager');
var IM          =       require('./controllers/item-manager');
var MM          =       require('./controllers/message-manager');
var GM          =       require('./controllers/group-manager');

var config = require('./../config.js');

var auth = require('./auth').authRequired;

module.exports = function(app) {

    require('./auth').routes(app);

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