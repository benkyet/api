var config = require('./../../config.js');
var knox = require('knox');

var s3 = knox.createClient({
    key: config.param('s3_key'),
    secret: config.param('s3_secret'),
    bucket: config.param('s3_bucket'),
    region: config.param('s3_region')
});

//s3.putBuffer(img, '/test/hello2.png', { 'x-amz-acl': 'public-read' }, function(err, res) {
//    console.log(res.statusCode)
//});

var Item = db.collection('item');
var Counter = db.collection('counter');

Counter.insert(
    {
        _id: "ref",
        seq: 0
    }
, function(e,d) {})

function getNextSequence(name, cb) {
    Counter.findAndModify(
        {_id: name},
        [],
        {$inc: {seq: 1}},
        {new: true},
        function(e, d) {
            console.log(e, d)
            cb(d.seq);
        }
    );
};

exports.getGroupList = function(req, res) {
    if(req.query.group === '') {
        Item.find({}).toArray(function(err, docs) {
            console.log(err, docs)
            var response = {
                status: 200,
                items: docs
            };
            res.status(200).json(response);
        })
    } else {
        Item.find({group: req.query.group}).toArray(function(err, docs) {
            var response = {
                status: 200,
                items: docs
            };
            res.status(200).json(response);
        })
    }
}

exports.getItem = function(req, res) {
    Item.findOne({ref: parseInt(req.params.ref)}, function(err, doc) {
        var successResponse = {
            status: 200,
            item: doc
        }
        console.log(doc)
        !doc ? res.status(404).json({status: 404, reason: 'Item not found'}) : res.status(200).send(successResponse);
    });
}

//Anonym.findAndModify(
//
//    {email: data.message.from_email},
//    [],
//    {$inc: {message_sent: 1}},
//    {new: true},
//    function(e2, d2) {
//        var imail = d2._id + '@mail.benkyet.com';
//        data.message.from_email = imail;
//        message.message = data.message;
//
//        mandrill.post('/messages/send.json')
//            .send(message)
//            .end(function(e3, r) {
//                var response_mandrill = r.body[0];
//                var response = {
//                    status: response_mandrill.status,
//                    email: response_mandrill.email,
//                    message_sent: d2.message_sent
//                };
//                response_mandrill.status === 'sent' || 'queued' ? res.status(200).json(response) : res.status(400);
//            });
//    }
//)

exports.addItem = function(req, res) {
    var data = req.body;

    var length = JSON.parse(data.pictures).length;
    console.log(data.name);
    console.log(length)
    var m = 0;

    for (var i = 0; i < length; i++) {
        var img = new Buffer(data.pictures[i], 'base64');
        var date = new Date()
        function closure (aImg, aDate, j) {
            return s3.putBuffer(aImg, 'test/' + aDate.valueOf().toString() + '.jpg', {'x-amz-acl': 'public-read'}, function(err, s3res) {
                //console.log(err, s3res.req.url);
                if(s3res.statusCode === 200) {
                    data.pictures[j] = s3res.req.url
                    m++;
                }

                if(m === length) {
                    data.seller_id = req.user._id;
                    getNextSequence('ref', function(ref) {
                        data.ref = ref;

                        Item.insert(data, function(dberr, doc) {
                            //if (err) throw err;
                            var response = {
                                status: 201,
                                item: doc[0]
                            };
                            res.status(201).json(response);
                        });
                    })



                };
            });
        };
        closure(img, date, i);
    }
};

exports.deleteItem = function(req, res) {
    var data = req.body;
    Item.remove({_id: data._id}, function(err, doc) {
        if(err) throw err;
        res.status(204).json(doc);
    })
}