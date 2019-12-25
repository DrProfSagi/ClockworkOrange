/*
*
*  This is the handlers page, it supports the route function
*
*/


// Dependensies
var getTime = require('./get_time');
var fs = require('fs');
var _data = require('./data');
var helpers = require('./helpers');
var _dataFile = require('./dataFile');
var _logs = require('./logs');

// Define all the handlers
var handlers = {};


/*
 * HTML Handlers
 *
 */

// Index
handlers.index = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Clockwork orange',
            'body.pageTitle' : 'ClockWork Orange',
            'body.class' : 'index'
        };
        // Read in a template as a string
        helpers.getTemplate('index',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// AboutMain
handlers.aboutMain = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Clockwork Orange',
            'body.pageTitle' : 'About Clockwork Orange',
            'body.class' : 'About'
        };
        // Read in a template as a string
        helpers.getTemplate('about',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// AboutMain
handlers.about = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Clockwork Orange',
            'body.pageTitle' : 'About Clockwork Orange',
            'body.class' : 'About'
        };
        // Read in a template as a string
        helpers.getTemplate('about',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// Create system
handlers.createSystem = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Create new system',
            'head.description' : 'Create a new system',
            'body.pageTitle' : 'ClockWork Orange',
            'body.class' : 'systemCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('systemCreate',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// Bulk add servers
handlers.bulkPage = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Bulk add to system',
            'head.description' : 'Add range of servers to system',
            'body.pageTitle' : 'Bulk Add',
            'body.class' : 'Bulk'
        };
        // Read in a template as a string
        helpers.getTemplate('bulk',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};

// Bulk add servers
handlers.bulkPageCreate = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'create a bulk system',
            'head.description' : 'Add range of servers and create system',
            'body.pageTitle' : 'Bulk Create',
            'body.class' : 'Bulk Create'
        };
        // Read in a template as a string
        helpers.getTemplate('bulkCreate',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// System Edit
handlers.editSystem = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Edit the system',
            'body.class' : 'systemEdit',
            'body.pageTitle' : data.queryStringObject.system + '.' + data.queryStringObject.domain
        };
        // Read in a template as a string
        helpers.getTemplate('systemEdit',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};



// Dashboard page
handlers.dashboard = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Status dashboard',
            'head.description' : 'view all systems',
            'body.pageTitle' : 'Dashboard',
            'body.class' : 'dashboard'
        };
        // Read in a template as a string
        helpers.getTemplate('dashboard',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};



// Marked page
handlers.marked = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Marked systems',
            'head.description' : 'view all systems',
            'body.pageTitle' : 'marked',
            'body.class' : 'marked'
        };
        // Read in a template as a string
        helpers.getTemplate('marked',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// admin page
handlers.admin = function(data, callback) {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        var templateData = {
            'head.title' : 'Admin page',
            'head.description' : 'Admin only page',
            'body.pageTitle' : 'admin',
            'body.class' : 'admin'
        };
        // Read in a template as a string
        helpers.getTemplate('admin',templateData,function(err,str){
            if(!err && str){
                // Add the universal header and footer
                helpers.addUniversalTemplates(str,templateData,function(err,str){
                    if(!err && str){
                        // Return that page as HTML
                        callback(200,str,'html');
                    } else {
                        callback(500,undefined,'html');
                    }
                });
            } else {
                callback(500,undefined,'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};


// Favicon
handlers.favicon = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Read in the favicon's data
        helpers.getStaticAsset('favicon.ico',function(err,data){
            if(!err && data){
                // Callback the data
                callback(200,data,'favicon');
            } else {
                callback(500);
            }
        });
    } else {
        callback(405);
    }
};

// Public assets
handlers.public = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length > 0){
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName,function(err,data){
                if(!err && data){

                    // Determine the content type (default to plain text)
                    var contentType = 'plain';

                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css';
                    }

                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png';
                    }

                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg';
                    }

                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200,data,contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }

    } else {
        callback(405);
    }
};



/*
 * JSON API Handlers
 *
 */

// Defire regex query
var regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;

// Ping
handlers.ping = function (data, callback) {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = helpers.checkTime(m);
    s = helpers.checkTime(s);
    callback(200,{'Time':h + ':' + m + ':' + s});
};

// Reloader
handlers.reloader = function(callback) {
    callback(200);
};


// Systems
handlers.systems = function(data,callback){
    var acceptableMethods = ['post','get','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._systems[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the users methods
handlers._systems  = {};

// Systems - post
// Required data: system, domain
// optional data: none
handlers._systems.post = function (data,callback) {
// Checks that all required data is recieved correctly
    var systemName = typeof(data.payload.system) == 'string' && data.payload.system.trim().length > 0 ? data.payload.system.trim().toLowerCase() : false;
    var domainName = typeof(data.payload.domain) == 'string' && data.payload.domain.trim().length > 0 && data.payload.domain.indexOf('.idf') > -1  ? data.payload.domain.trim().toLowerCase() : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName) {
// Validate that the system in that domain is not already present.
        _data.read(fullname, function (err, data) {
            if(err){
                var systemObject = {
                    'system' : systemName,
                    'domain' : domainName
                };
                _data.create(fullname,systemObject,function (err) {
                    if(!err){
                        callback(200);
                    } else {
                        callback(500,{'Error' : 'could not create the system'});
                    }
                });
            } else {
                callback(400,{'Error' : 'A system in this domain already exists!'});
            }
        } );
    } else {
        callback(400, {'Error' : 'Missing required fields!!!'});
    }
};

// Systems - get
// Required fields: system name, domain name
// Optional fields: none
handlers._systems.get = function(data,callback){
    // Check that system name and domain name are valid
    var systemName = typeof(data.queryStringObject.system) == 'string' && data.queryStringObject.system.trim().length > 0 ? data.queryStringObject.system.trim().toLowerCase() : false;
    var domainName = typeof(data.queryStringObject.domain) == 'string' && data.queryStringObject.domain.trim().length > 0 && data.queryStringObject.domain.indexOf('.idf') > -1 ? data.queryStringObject.domain.trim().toLowerCase() : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName){
        if (systemName == 'all' && domainName == 'all.idf') {
            _data.list(function (err, systems) {
                if (!err && systems && systems.length > 0) {
                    var output = [];
                    systems.forEach(function (system) {
                        var obj = {};
                        if (system) {
                            obj.system = system.system;
                            obj.domain = system.domain;
                            obj.status = system.status;
                            obj.servers = system.servers;
                            output.push(obj);
                        }
                    });
                    callback(200, output);
                } else {
                    callback(400, {'Error' : 'Failed to find systems'});
                }
            });
        } else {
            _data.read(fullname, function (err, data) {
                if (!err && data) {
                    callback(200, data);
                } else {
                    callback(404);
                }
            });
        }
    } else {
        callback(404);
    }
};

// Systems - delete
// Required fields: system name, domain name
// Optional fields: none
handlers._systems.delete = function(data, callback) {
    // Check that system name and domain name are valid
    var systemName = typeof(data.queryStringObject.system) == 'string' && data.queryStringObject.system.trim().length > 0 ? data.queryStringObject.system.trim().toLowerCase() : false;
    var domainName = typeof(data.queryStringObject.domain) == 'string' && data.queryStringObject.domain.trim().length > 0 && data.queryStringObject.domain.indexOf('.idf') > -1 ? data.queryStringObject.domain.trim().toLowerCase() : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName){
        _data.read(fullname, function (err) {
            if(!err){
// Deletes the system
                _data.delete(fullname, function (err) {
                    if(err) {
                        callback(500);
                    } else {
                        callback(200);
                    }
                });
            } else {
                callback(404, {'Error' : 'Failed to delete system object!'});
            }

        });
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
};


// Servers
handlers.servers = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._servers[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the users methods
handlers._servers  = {};

// Servers - post
// Required data: server name, system name, domain name
// Optional data: none
handlers._servers.post = function (data, callback){
    var serverName = typeof(data.payload.servers) == 'string' && data.payload.servers.trim().length > 0  ? data.payload.servers.trim().toLowerCase() : false;
    var systemName = typeof(data.payload.system) == 'string' && data.payload.system.trim().length > 0 ? data.payload.system.trim().toLowerCase() : false;
    var domainName = typeof(data.payload.domain) == 'string' && data.payload.domain.trim().length > 0 && data.payload.domain.indexOf('.idf') > -1  ? data.payload.domain.trim().toLowerCase() : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if (serverName && systemName && domainName) {
        // Validate a system in this name and domain exists
        _data.read(fullname,function (err, data) {
            if (!err && data){
// Check if the server name already exsists in the system
                if (data.servers.indexOf(serverName) < 0) {
                    data.servers.push(serverName);
                    _data.update(fullname, data, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500,{'Error' : 'Failed to add ' + serverName + ' to ' + systemName});
                        }
                    });
                } else {
                    callback(404,{'Error' : 'Server already registered to system!'});
                }
            } else {
                callback(400,{
                    'Erorr' : 'caught error' + err,
                    'Data' : 'with data :' + data
                });
            }
        });
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
};

// Servers - get
// Required data: system name, domain name
// Optional data: none
handlers._servers.get = function(data,callback){
    // Check that system name and domain name are valid
    var systemName = typeof(data.queryStringObject.system) == 'string' && data.queryStringObject.system.trim().length > 0 ? data.queryStringObject.system.trim().toLowerCase() : false;
    var domainName = typeof(data.queryStringObject.domain) == 'string' && data.queryStringObject.domain.trim().length > 0 && data.queryStringObject.domain.indexOf('.idf') > -1 ? data.queryStringObject.domain.trim().toLowerCase() : false;
    data.status = typeof(data.domain) == 'string' && ['good', 'bad', 'unknown'].indexOf(data.status) > -1 ? data.status : 'unknown';
    data.bad = typeof(data.bad) == 'object' && data.bad instanceof Array && data.bad.length > 0 ? data.bad : [];
    data.good = typeof(data.good) == 'object' && data.good instanceof Array && data.good.length > 0 ? data.good : [];
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName){
        _data.read(fullname,function(err,data){
            if(!err && data) {
                //data = JSON.parse(data);
                if (data.servers.length > 0) {
                    var unknowns = [];
                    data.servers.forEach(function (serverInQuestion) {
                        var unknown = data.good.indexOf(serverInQuestion) < 0 && data.bad.indexOf(serverInQuestion) < 0 ? serverInQuestion : false;
                        if (unknown) {
                            unknowns.push(unknown);
                        }
                    });
                    var output = {
                        'good': data.good,
                        'bad': data.bad,
                        'unknown': unknowns
                    };
                    callback(200, output);
                } else {
                    callback(200,'{}');
                }
            } else {
                callback(404, {'Error' : 'No servers found in system'});
            }
        });
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
};

// Servers - delete
// Required data: server name, system name, domain name
// Optional data: none
handlers._servers.delete = function(data, callback) {
    // Check that system name and domain name are valid
    var serverName = typeof(data.queryStringObject.servers) == 'string' && data.queryStringObject.servers.trim().length > 0 ? data.queryStringObject.servers.trim().toLowerCase() : false;
    var systemName = typeof(data.queryStringObject.system) == 'string' && data.queryStringObject.system.trim().length > 0 ? data.queryStringObject.system.trim().toLowerCase() : false;
    var domainName = typeof(data.queryStringObject.domain) == 'string' && data.queryStringObject.domain.trim().length > 0 && data.queryStringObject.domain.indexOf('.idf') > -1 ? data.queryStringObject.domain.trim().toLowerCase() : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName && serverName){
        _data.read(fullname, function (err,data) {
            if(!err && data.servers.indexOf(serverName) > -1){
// Deletes the server
                data.servers.splice(data.servers.indexOf(serverName),1);
                if (data.good.indexOf(serverName) > -1) {
                    data.good.splice(data.good.indexOf(serverName),1);
                }
                if (data.bad.indexOf(serverName) > -1) {
                    data.bad.splice(data.bad.indexOf(serverName),1);
                }
                _data.update(fullname, data, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500,{'Error' : 'Failed to remove ' + serverName + ' from ' + systemName});
                    }
                });

            } else {
                callback(404, {'Error' : 'Server not registered in system'});
            }

        });
    } else {
        callback(400,{'Error' : 'Missing required field'});
    }
};


handlers.bulk = function (data, callback) {
    // Checks that all required data is recieved correctly
    var systemName = typeof(data.payload.system) == 'string' && data.payload.system.trim().length > 0 ? data.payload.system.trim().toLowerCase() : false;
    var prefixData = typeof(data.payload.prefix) == 'string' && data.payload.prefix.trim().length > 0 ? data.payload.prefix.trim().toLowerCase() : false;
    var suffixData = typeof(data.payload.suffix) == 'string' && data.payload.suffix.trim().length > 0 ? data.payload.suffix.trim().toLowerCase() : '';
    var placeNum = parseInt(data.payload.places) > 0 ? parseInt(data.payload.places) : false;
    var startNum = parseInt(data.payload.starter) != parseInt(data.payload.ender) && data.payload.starter.toString().length <= placeNum ? parseInt(data.payload.starter) : false;
    var endNum = parseInt(data.payload.starter) < parseInt(data.payload.ender) && data.payload.ender.toString().length <= placeNum ? parseInt(data.payload.ender) : false;
    var fullname = systemName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName &&
    prefixData && placeNum &&
    startNum && endNum){
        // Validate a system in this name and domain exists
        _data.read(fullname,function (err, data) {
            if (!err && data){
// Check if the server name already exsists in the system
                var range = [];
                for (var i = startNum; i <= endNum; i++){
                    i = i.toString();
                    while(i.length < placeNum){
                        i = '0' + i;
                    }
                    var serverName = prefixData + i + suffixData;
                    if (data.servers.indexOf(serverName) < 0) {
                        range.push(serverName);
                        data.servers.push(serverName);
                    }

                }
                if (range.length > 0){
                    _data.update(fullname, data, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500,{'Error' : 'Failed to add ' + serverName + ' to ' + systemName});
                        }
                    });
                }
            } else {
                callback(400,{
                    'Erorr' : 'caught error' + err,
                    'Data' : 'with data :' + data
                });
            }
        });

    } else {
        callback(400, {'Error': 'Missing required fields'});
    }

};



handlers.createBulk = function (data,callback) {
    // Checks that all required data is recieved correctly
    var systemName = typeof(data.payload.system) == 'string' && data.payload.system.trim().length > 0 ? data.payload.system.trim().toLowerCase() : false;
    var domainName = typeof(data.payload.domain) == 'string' && data.payload.domain.trim().length > 0 && data.payload.domain.indexOf('.idf') > -1  ? data.payload.domain.trim().toLowerCase() : false;
    var prefixData = typeof(data.payload.prefix) == 'string' && data.payload.prefix.trim().length > 0 ? data.payload.prefix.trim().toLowerCase() : false;
    var suffixData = typeof(data.payload.suffix) == 'string' && data.payload.suffix.trim().length > 0 ? data.payload.suffix.trim().toLowerCase() : '';
    var placeNum = parseInt(data.payload.places) > 0 ? parseInt(data.payload.places) : false;
    var startNum = parseInt(data.payload.starter) != parseInt(data.payload.ender) && data.payload.starter.toString().length <= placeNum ? parseInt(data.payload.starter) : false;
    var endNum = parseInt(data.payload.starter) < parseInt(data.payload.ender) && data.payload.ender.toString().length <= placeNum ? parseInt(data.payload.ender) : false;
    var fullname = systemName + '_' + domainName;
    fullname = fullname.replace(/\./g,'_');
    if(systemName && domainName &&
        prefixData && placeNum &&
        startNum && endNum) {
// Validate that the system in that domain is not already present.
        _data.read(fullname, function (err, data) {
            if(err){
                var range = [];
                for (var i = startNum; i <= endNum; i++){
                    i = i.toString();
                    while(i.length < placeNum){
                        i = '0' + i;
                    }
                    var serverName = prefixData + i + suffixData;
                        range.push(serverName);
                }
                var systemObject = {
                    'system' : systemName,
                    'domain' : domainName,
                    'servers' : range
                };
                _data.createBulk(fullname,systemObject,function (err) {
                    if(!err){
                        callback(200);
                    } else {
                        callback(500,{'Error' : 'could not create the Bulk system'});
                    }
                });
            } else {
                callback(400,{'Error' : 'A system in this domain already exists!'});
            }
        } );
    } else {
        callback(400, {'Error' : 'Missing required fields!!!'});
    }
};





// Auth
handlers.auth = function(data,callback){
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._auth[data.method](data,callback);
    } else {
        callback(405);
    }
};


handlers._auth = {};


// Auth post
handlers._auth.post = function (data, callback){
    var pass = typeof(data.payload.pass) == 'string' && data.payload.pass.trim().length > 0 ? data.payload.pass : false;
    if(pass){
        var hashed = helpers.hash(pass);
        _dataFile.read('.auth','admin', function (err, data) {
            if (!err && data){
                if (data.passw0rd === hashed){
                    // @TODO add the following function and use tokens
                    /*var fileName = helpers.createRandomString(6);
                    var tokenData = {
                        "id" : fileName,
                        "timeStamp" : Date.now(),
                        "expire" : Date.now() + 9000000
                    };
                    _dataFile.create('.tokens',fileName, tokenData, function (err) {
                        if (!err){
                            callback(200);
                        } else {
                            callback(401);
                        }
                    });*/
                    callback(200);
                } else {
                    callback(400, {"Error":"Incorrect password!"});
                }
            } else {
                callback(500);
            }
        });
    } else {
        callback(400);
    }

};

// Logs get
handlers.logs = function (data, callback){
    if (data.method == 'get'){
        // Validate received data
        var list = typeof(data.queryStringObject.list) == 'string' && data.queryStringObject.list == "true" ? true : false;
        var comp = typeof(data.queryStringObject.comp) == 'string' && data.queryStringObject.comp == "true" ? true : false;
        var logName = typeof(data.queryStringObject.logName) == 'string' && data.queryStringObject.logName.trim().length > 0 ? data.queryStringObject.logName.trim() : false;
        // Lists all the logs that are not compressed
        if (list && !comp && !logName){
            _logs.list(false, function (err, data) {
                if (!err && data){
                    callback(200,{"logs" : data});
                } else {
                    callback(500,err);
                }
            });
        // Lists all the logs that are compressed
        } else if(list && comp && !logName ) {
            _logs.listComp(function (err, data) {
                if (!err && data){
                    callback(200,{"logs" : data});
                } else {
                    callback(500,err);
                }
            });
        // Reads an uncompressed log file
        } else if (!list && !comp && logName ) {
            // Validate the file is not compressed
            _logs.list(false, function (err, data) {
                if (!err && data){
                    if (data.indexOf(logName) > -1){
                        _logs.read(logName, function (err, logData) {
                            if (!err){
                                //callback(200, {"data":logData});
                                callback(200, {"data":logData});
                            } else {
                                callback(500, {"Error":"Failed to open file"});
                            }
                        });
                    } else {
                        callback(404, {"Error" : "File not found or is compressed"});
                    }
                } else {
                    callback(500,{"Error":"Failed to find file"});
                }
            });
        // Reads a compressed file
        } else if (!list && comp && logName) {
            _logs.listComp(function (err, data) {
                if (!err && data){
                    if (data.indexOf(logName) > -1){
                        _logs.decompress(logName, function (err, data) {
                            if (!err && data){
                                callback(200, {"data":data});
                            } else {
                                callback(500, err);
                            }
                        });
                    } else {
                        callback(404, {"Error" : "File not found or is not compressed"});
                    }
                } else {
                    callback(500,err);
                }
            });
        // Falls back to error, unvalid data
        } else {
            callback(400, {"Error":data.queryStringObject});
        }
    } else {
        callback(505);
    }
};














handlers.notFound = function (data, callback) {
    callback(404,{'Error' : 'Not found!'});
};




module.exports = handlers;