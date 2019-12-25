/*
*
* Author: Sagi Lahav
* primary file for api
*
*/

var getTime = require('./get_time');
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// Creating server object
var server = {};



// Instance the HTTP server
server.httpServer = http.createServer(function (req,res) {
    server.unifiedServer(req,res);
});




// All the server logic for both http and https
server.unifiedServer = function (req,res) {

    // Parse the url
    var parseUrl = url.parse(req.url, true);

    // Get the path
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parseUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });


    req.on('end', function() {
        buffer += decoder.end();

        // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

            // Route the request to the handler specified in the router
            chosenHandler(data, function (statusCode, payload, contentType) {

                // Determine the type of response (fallback to JSON)
                contentType = typeof(contentType) == 'string' ? contentType : 'json';

                // Use the status code returned from the handler, or set the default status code to 200
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

                // Return the response parts that are content-type specific
                var payloadString = '';
                if (contentType == 'json') {
                    res.setHeader('Content-Type', 'application/json');
                    payload = typeof(payload) == 'object' ? payload : {};
                    payloadString = JSON.stringify(payload);
                }

                if (contentType == 'html') {
                    res.setHeader('Content-Type', 'text/html');
                    payloadString = typeof(payload) == 'string' ? payload : '';
                }

                if (contentType == 'favicon') {
                    res.setHeader('Content-Type', 'image/x-icon');
                    payloadString = typeof(payload) !== 'undefined' ? payload : '';
                }

                if (contentType == 'plain') {
                    res.setHeader('Content-Type', 'text/plain');
                    payloadString = typeof(payload) !== 'undefined' ? payload : '';
                }

                if (contentType == 'css') {
                    res.setHeader('Content-Type', 'text/css');
                    payloadString = typeof(payload) !== 'undefined' ? payload : '';
                }

                if (contentType == 'png') {
                    res.setHeader('Content-Type', 'image/png');
                    payloadString = typeof(payload) !== 'undefined' ? payload : '';
                }

                if (contentType == 'jpg') {
                    res.setHeader('Content-Type', 'image/jpeg');
                    payloadString = typeof(payload) !== 'undefined' ? payload : '';
                }


                // Return the response-parts common to all content-types
                res.writeHead(statusCode);
                res.end(payloadString);

            });
    });
};

server.router = {
    '' : handlers.index,
    'ping' : handlers.ping,
    'system/create' : handlers.createSystem,
    'system/edit' : handlers.editSystem,
    'api/sys' : handlers.systems,
    'api/srv' : handlers.servers,
    'api/bulk' : handlers.bulk,
    'api/bulkCreate' : handlers.createBulk,
    'api/auth' : handlers.auth,
    'api/logs' : handlers.logs,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public,
    'dashboard' : handlers.dashboard,
    'marked' : handlers.marked,
    'bulk': handlers.bulkPage,
    'bulkCreate': handlers.bulkPageCreate,
    'about' : handlers.about,
    'admin' : handlers.admin
};



// Create the init function
server.init = function() {

// Start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[32m%s\x1b[0m','HTTP server listens on port', config.httpPort);
    });
};


// Exporting the whole server
module.exports = server;