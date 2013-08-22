var supertest   =   require('supertest');
var mandrill    =   supertest('https://mandrillapp.com/api/1.0/');
var config      =   require('./../../config.js');

var Message     =   db.collection('message');
var Anonym      =   db.collection('anonym');
var User        =   db.collection('user');
var ObjectID    =   require('mongodb').ObjectID;
function getId(id) {
    return new ObjectID(id);
}





exports.addMessageToDb = function(req, res) {
    var data = req.body;

    /* TODO:  1- Check if data.from property exists
                a) If not, add this user to the anonym collection, {imail, email, _id}
              2- If it's a known user, check the user collection and replace his email
              with his imail.
     */
    var message = {
        "key": config.param('mandrill_key'),
        "message": {
            "html": "<p>"+data.message.body+"</p>",
            "text": "Example text content",
            "subject": "History Text Book",
            "from_email": "",
            "from_name": data.message.name,
            "to": [
                {
                    "email": "",
                    "name": ""
                }
            ],
            "headers": {
                "Reply-To": ""
            }
        }
    };



    if(!data.user) {


        User.findOne({_id: getId(data.seller_id)}, function(e2, d2) {
            console.log(e2, d2)
            message.message.to[0].email = d2.email;
            message.message.to[0].name = d2.first;
            message.message.from_name = 'james'
            message.message.from_email = 'james@mail.benkyet.com'


            mandrill.post('/messages/send.json')
                .send(message)
                .end(function(ee, rr) {
                    var response_mandrill = rr.body[0];
                    var response = {
                        status: response_mandrill.status,
                        email: response_mandrill.email
                    };
                    console.log(response);
                    response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
                });


        })


        Anonym.findOne({email: data.message.email}, function(e, d) {








            Anonym.insert({email: data.message.email, message_sent: 1}, function(e1, d1) {
                if(e1) throw e1;
                var imail = d1[0]._id + '@mail.benkyet.com';
                data.message.from_email = imail;
                data.headers['Reply-To'] = imail;







            });

            if(!d) {


            } else {
//                Anonym.findAndModify(
//
//                        {email: data.message.from_email},
//                        [],
//                        {$inc: {message_sent: 1}},
//                        {new: true},
//                    function(e2, d2) {
//                        var imail = d2._id + '@mail.benkyet.com';
//                        data.message.from_email = imail;
//                        message.message = data.message;
//
//                        mandrill.post('/messages/send.json')
//                            .send(message)
//                            .end(function(e3, r) {
//                                var response_mandrill = r.body[0];
//                                var response = {
//                                    status: response_mandrill.status,
//                                    email: response_mandrill.email,
//                                    message_sent: d2.message_sent
//                                };
//                                response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
//                            });
//                    }
//                )
            }

        })







    } else {

    }

}