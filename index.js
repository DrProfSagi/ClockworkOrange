/*
 *
 * Primary file for API
 *
 */

// Dependencies
var server = require('./modules/server');
var childLabor = require('child_process');


// Declare the app
var app = {};

// Init function
app.init = function(){

    // Start the server
    server.init();

    // Starts the workers in a child process
    childLabor.fork('./modules/child');

};

// Self executing
app.init();


// Export the app
module.exports = app;
