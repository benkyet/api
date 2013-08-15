var Item = db.collection('item');

exports.addItem = function(req, res) {
    var data = req.body;
    data.username = req.user.username;
    Item.insert(data, function(err, doc) {
        if (err) throw err;
        res.status(201).json(doc[0]);
    });
};

exports.deleteItem = function(req, res) {
    var data = req.body;
    Item.remove({_id: data._id}, function(err, doc) {
        if(err) throw err;
        res.status(204).json(doc);
    })
}