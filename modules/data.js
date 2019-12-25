/*
 * Library for storing and editing data from mongoDb
 *
 */

// Dependencies
var helpers = require('./helpers');
var mongo = require('./mongo');
var util = require('util');
var debug = util.debuglog('data');



// Initialise the data variable
var mlib = {};



// Create a new document for a system
mlib.create = function(query, data, callback){
    var systemName = data.system;
    var domainName = data.domain;
    var newSystem = new mongo ({
        _id: query,
        system: systemName,
        domain: domainName,
        servers: [],
        status: 'unknown',
        bad: [],
        good: []
    });
    debug(newSystem);
    newSystem.save(function (err) {
        if (err) {
            debug('Failed to save!');
            callback('Failed to save');
        } else {
            debug('created successfully!');
            callback(false);
        }
    });
};


// Delete system document
mlib.delete = function(query, callback) {
    mongo.deleteOne({_id : query}, function (err) {
        if (err){
            callback(err);
        } else {
            callback(false);
        }
    });
};



// Get the data of a system
mlib.read = function(query, callback){
    mongo.findById({_id:query},function (err, data) {
        if (data){
            callback(false, data);
            debug('got the data');
        } else {
            debug('error while getting data');
            callback({'Error':'No object by this id found'}, data);
        }
    });
};


mlib.update = function(query, updateData, callback){
        mongo.updateOne({_id:query}, updateData, function (err, data) {
            if (err){
                callback(err,data);
                debug('Error: ' + err);
            } else {
                callback(false, data);
            }
        });
};

mlib.list = function(callback){
    mongo.find({}).exec(function (err, data) {
        if(!err && data.length > 0 ){
            callback(false, data);
        } else if (!err){
            callback('No systems found in DB');
        } else {
            callback(err);
        }
    });
};


mlib.listVc = function(callback){
    mongo.find({"system":"vc"}).exec(function (err, data) {
        if(!err && data.length > 0 ){
            callback(false, data);
        } else if (!err){
            callback('No systems found in DB');
        } else {
            callback(err);
        }
    });
};

// Create a new document for a system Bulk
mlib.createBulk = function(query, data, callback){
    var systemName = data.system;
    var domainName = data.domain;
    var serverList = data.servers;
    var newSystem = new mongo ({
        _id: query,
        system: systemName,
        domain: domainName,
        servers: serverList,
        status: 'unknown',
        bad: [],
        good: []
    });
    debug(newSystem);
    newSystem.save(function (err) {
        if (err) {
            debug('Failed to save!');
            callback('Failed to save');
        } else {
            debug('created successfully!');
            callback(false);
        }
    });
};



// Export the module
module.exports = mlib;
