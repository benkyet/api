var Group = db.collection('groups');

exports.getGroups = function(req, res) {

    Group.findOne({group_list: {$exists: true}}, function(err, doc) {
        var response = {
            status: 200,
            groups: doc.group_list
        };
        res.status(200).json(response);
    })
};

exports.getEventsForGroup = function(req, res) {
    Group.findOne({group: req.param('group')}, function(err, doc) {
        var response = {
            status: 200,
            group: doc
        };
        res.status(200).json(response);
    })
}