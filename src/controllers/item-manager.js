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

exports.addItem = function(req, res) {
    var data = req.body;
    var length = data.pictures.length;
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
                    Item.insert(data, function(dberr, doc) {
                        //if (err) throw err;
                        var response = {
                            status: 201,
                            item: doc[0]
                        };
                        res.status(201).json(response);
                    });
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