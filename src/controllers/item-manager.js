var config = require('./../../config.js');
var knox = require('knox');

var s3 = knox.createClient({
    key: config.param('s3_key'),
    secret: config.param('s3_secret'),
    bucket: config.param('s3_bucket'),
    region: config.param('s3_region')
});


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
            cb(d.seq);
        }
    );
};

exports.getGroupList = function(req, res) {
    if(req.query.group === '') {
        Item.find({}).toArray(function(err, docs) {
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
        };
        !doc ? res.status(404).json({status: 404, reason: 'Item not found'}) : res.status(200).send(successResponse);
    });
};

exports.addItem = function(req, res) {
    var data = req.body;
    data.pictures = JSON.parse(data.pictures);
    var length = data.pictures.length;
    var m = 0

    for (var i = 0; i < length; i++) {
        var img = new Buffer(data.pictures[i], 'base64');
        var date = new Date()
        function closure (aImg, aDate, j) {
            return s3.putBuffer(aImg, config.param('s3_folder') + aDate.valueOf().toString() + '.jpg', {'x-amz-acl': 'public-read'}, function(err, s3res) {
                //console.log(err, s3res.req.url);
                if(s3res.statusCode === 200) {
                    data.pictures[j] = s3res.req.url
                    m++;
                }

                if(m === length) {
                    data.seller_id = req.user.user_id;
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

    Item.remove({ref: data.ref}, function(err, doc) {
        if(err) throw err;
        var response = {
            status: 204,
            items_deleted: doc
        };

        res.status(200).send(response);
    });
};