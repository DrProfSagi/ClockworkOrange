/*
 * Library for connecting to mongoDB, should be called once, at the initialisation of the server
 *
 */

// Dependencies
var mongoose = require('mongoose');
var util = require('util');
var debug = util.debuglog('mongo');


var uristring = 'mongodb://localhost:27017/clockworkorange';


// Connects to the db
mongoose.connect(uristring, { useNewUrlParser: true }, (err,res) => {
    if (err) {
        debug('error cpnnecting to:', + uristring + '. ' + err);
    } else {
        debug('connected to:', uristring);
    }
} );

// Create the document schema
var systemSchema = new mongoose.Schema({
    _id: String,
    system: String,
    domain: String,
    servers: Array,
    status: String,
    bad: Array,
    good: Array
});


var systemModel = mongoose.model('systems', systemSchema);

module.exports = systemModel;