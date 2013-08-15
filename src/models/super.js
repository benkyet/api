var Q = require('q');
var ObjectID = require('mongodb').ObjectID;


/**
 * Export Constructor Function
 * @param collection
 * @constructor
 */
var ModelConstructor = exports.ModelConstructor = function ModelConstructor(collection) {
    this.collection = database.createCollection(collection);
}
/**
 *
 * @returns {*}
 * @constructor
 */
ModelConstructor.prototype.cloneObject = function (source) {
    for (i in source) {
        this[i] = source[i];
    }
}
/**
 *
 * @returns {*}
 * @constructor
 */
ModelConstructor.prototype.ObjectID = function () {
    return ObjectID();
}
/**
 * MongoDB BSON lookup
 * Used in pretty much every model
 * @param id
 * @returns {ObjectID}
 */
ModelConstructor.prototype.getObjectId = function (id) {
    return this.collection.db.bson_serializer.ObjectID.createFromHexString(id);
}
/**
 * Wrapper for the insert method
 * @param data
 * @returns {*}
 */
ModelConstructor.prototype.insert = function(data, options) {
    return Q.nfapply(this.collection.insert.bind(this.collection), arguments);
}
/**
 * Wrapper for the remove method
 * @param data
 * @returns {*}
 */
ModelConstructor.prototype.remove = function(data, options) {
    return Q.nfapply(this.collection.remove.bind(this.collection), arguments);
}
/**
 * Find One Doc In Collection With Criteria
 * @param criteria
 * @returns {*}
 */
ModelConstructor.prototype.findOne = function(criteria, options) {
    return Q.nfapply(this.collection.findOne.bind(this.collection), arguments);
}
ModelConstructor.prototype.findOneForValidation = function (criteria, options) {
    var deferred = Q.defer();
    var args = [].slice.call(arguments);
    args.push(
        function(err, doc) {
            if(doc) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }
    )
    this.collection.findOne.apply(this.collection, args);
    return deferred.promise;
}
/**
 * Implementation of find From Mongodb
 * @param criteria
 * @returns {*}
 */
ModelConstructor.prototype.find = function(criteria) {
    var deferred = Q.defer();
    this.collection.find(criteria).toArray(function(err, records) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(records);
        }
    })
    return deferred.promise;
}
/**
 *
 * @param criteria
 * @param update
 */
ModelConstructor.prototype.update = function(criteria, update) {
    return Q.nfapply(this.collection.update.bind(this.collection), arguments)
}
/**
 * Wrapper for the save method
 * @param data
 * @returns {*}
 */
ModelConstructor.prototype.save = function(data) {
    return Q.ninvoke(this.collection, 'save', data, {safe: true});
}
/**
 * Wrapper for findAndModify
 * @param criteria
 * @param sort
 * @param update
 * @returns {*}
 */
ModelConstructor.prototype.findAndModify = function(criteria, sort, update, options) {
    return Q.nfapply(this.collection.findAndModify.bind(this.collection), arguments)
}