var supertest   =   require('supertest');
var mandrill    =   supertest('https://mandrillapp.com/api/1.0/');
var config      =   require('./../../config.js');

var Message     =   db.collection('message');
var Anonym      =   db.collection('anonym');

exports.addMessageToDb = function(req, res) {
    var data = req.body;

    /* TODO:  1- Check if data.from property exists
                a) If not, add this user to the anonym collection, {imail, email, _id}
              2- If it's a known user, check the user collection and replace his email
              with his imail.
     */
    var message = {
        "key": config.param('mandrill_test')
    }
    if(!data.user) {

        Anonym.findOne({email: data.message.from_email}, function(e, d) {
            if(!d) {

                Anonym.insert({email: data.message.from_email, message_sent: 1}, function(e1, d1) {
                    if(e1) throw e1;
                    var imail = d1[0]._id + '@mail.benkyet.com';
                    data.message.from_email = imail;

                    message.message = data.message;
                    mandrill.post('/messages/send.json')
                        .send(message)
                        .end(function(e, r) {
                            var response_mandrill = r.body[0];
                            var response = {
                                status: response_mandrill.status,
                                email: response_mandrill.email,
                                message_sent: d1[0].message_sent
                            };
                            console.log(response);
                            response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
                        });
                });
            } else {
                Anonym.findAndModify(

                        {email: data.message.from_email},
                        [],
                        {$inc: {message_sent: 1}},
                        {new: true},
                    function(e2, d2) {
                        var imail = d2._id + '@mail.benkyet.com';
                        data.message.from_email = imail;
                        message.message = data.message;

                        mandrill.post('/messages/send.json')
                            .send(message)
                            .end(function(e3, r) {
                                var response_mandrill = r.body[0];
                                var response = {
                                    status: response_mandrill.status,
                                    email: response_mandrill.email,
                                    message_sent: d2.message_sent
                                };
                                response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
                            });
                    }
                )
            }

        })







    } else {

    }

}