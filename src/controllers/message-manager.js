var supertest   =   require('supertest');
var mandrill    =   supertest('https://mandrillapp.com/api/1.0/');
var config      =   require('./../../config.js');

var User        =   db.collection('user');
var ObjectID    =   require('mongodb').ObjectID;
function getId(id) {
    return new ObjectID(id);
}



exports.inboundMessage = function(req, res) {
    console.log(req.body)
}

exports.addMessageToDb = function(req, res) {
    var data = req.body;

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
                    "name": "hello"
                }
            ],
            "headers": {
                "Reply-To": "hello"
            }
        }
    };


    User.findOne({_id: getId(data.seller_id)}, function(err, doc) {
        message.message.to[0].email = doc.email;
        message.message.to[0].name = doc.username;

        User.findAndModify(
            {email: data.message.email},
            [],
            {$inc: {message_sent: 1}},
            {upsert: true, new: true},
            function(err2, sender) {
                console.log(err2, sender)
                message.message.from_email = sender.email.split('@')[0] + '@mail.benkyet.com';

                mandrill.post('/messages/send.json')
                    .send(message)
                    .end(function(m_err, m_res) {
                        var response_mandrill = m_res.body[0];
                        var response = {
                            status: response_mandrill.status,
                            email: response_mandrill.email
                        };
                        console.log(response);
                        response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
                    });
            }
        )

    });
};