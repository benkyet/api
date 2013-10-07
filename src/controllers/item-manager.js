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

var ObjectID    =   require('mongodb').ObjectID;
function getId(id) {
    return new ObjectID(id);
};

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

    if(data.pictures === undefined) {
        data.pictures = ['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'];
    } else {
        data.pictures = JSON.parse(data.pictures);
    }

    var length = data.pictures.length;
    var m = 0;
    console.log(data)

    for (var i = 0; i < length; i++) {
        var img = new Buffer(data.pictures[i].split(',')[1], 'base64');
        var date = new Date()
        function closure (aImg, aDate, j) {
            return s3.putBuffer(aImg, config.param('s3_folder') + aDate.valueOf().toString() + '.jpg', {'x-amz-acl': 'public-read'}, function(err, s3res) {
                //console.log(err, s3res.req.url);
                if(s3res.statusCode === 200) {
                    data.pictures[j] = s3res.req.url
                    m++;
                }

                if(m === length) {
                    console.log(req.user)
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

//TODO: ability to add/edit a picture as well
exports.updateItem = function(req, res) {
    var data = req.body;
    console.log(data)
    var item_id = data._id;
    var item_to_update = data;
    delete item_to_update._id;
    var update = {$set: {}};
    uploadPicToS3(data.pictures, function(imgs) {
        item_to_update.pictures = imgs;
        for(prop in item_to_update) {
            update.$set[prop] = item_to_update[prop];
        };


        Item.findAndModify(
            {_id: getId(item_id)},
            [],
            update,
            {new: true},
            function(err, doc) {
                console.log(err, doc)
                res.status(200).json({status: 200, item: doc});
            }
        )
    });

};

function uploadPicToS3 (imgs, callback) {

    var length = imgs.length;
    var m = 0

    for (var i = 0; i < length; i++) {
        var img = new Buffer(imgs[i].split(',')[1], 'base64');
        var date = new Date()
        function closure (aImg, aDate, j) {
            return s3.putBuffer(aImg, config.param('s3_folder') + aDate.valueOf().toString() + '.jpg', {'x-amz-acl': 'public-read'}, function(err, s3res) {
                //console.log(err, s3res.req.url);
                if(s3res.statusCode === 200) {
                    imgs[j] = s3res.req.url
                    m++;
                }

                if(m === length) {

                    callback(imgs);



                };
            });
        };
        closure(img, date, i);
    }
}

exports.deleteItem = function(req, res) {

    Item.remove({ref: parseInt(req.params.ref)}, function(err, doc) {
        if(err) throw err;
        var response = {
            status: 204,
            items_deleted: doc
        };

        res.status(200).send(response);
    });
};