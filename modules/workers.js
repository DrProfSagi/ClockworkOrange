/*
*
* The main workers
*
*/

// Dependencies
var _data = require('./data');
var getTime = require('./get_time');
var util = require('util');
var debug = util.debuglog('workers');
var _logs = require('./logs');
var helpers = require('./helpers');

// Instenciate the workers object
var workers = {};


// Lookup all the servers, get their data, send to a validator
workers.gatherAllChecks = function() {
// get all the systems
    _data.list(function (err, systems) {
        if(!err && systems && systems.length > 0){
            systems.forEach(function (system) {
                if (system && system.system != 'vc') {
                    _data.read(system._id, function (err, data) {
                        if(data && !err){
                            // Checks if there are servers in the system.
                            if (data.servers.length > 0) {
                                debug('starting to check on ' + data._id );
                                workers.validateAllChecks(data);
                            } else {
                                debug("No servers found in " + data.system);
                                workers.noServers(data);
                            }
                        } else {
                            debug("Error while getting system's data");
                        }
                    });

                } else {
                    debug("Error reading one of the checks data Or system is a VC");
                }
            });
        } else {
            debug("Error: Could not find any systems");
        }
    });
};

// Validating all the data is good
workers.validateAllChecks = function(originalSystemData) {
// Checks to see if all system data is valid
    originalSystemData = typeof(originalSystemData) == 'object' && originalSystemData !== null ? originalSystemData : {};
    originalSystemData.servers = typeof(originalSystemData.servers) == 'object' && originalSystemData.servers instanceof Array && originalSystemData.servers.length > 0 ? originalSystemData.servers : false;
    originalSystemData.system = typeof(originalSystemData.system) == 'string' && originalSystemData.system.trim().length > 0 ? originalSystemData.system.trim().toLowerCase() : false;
    originalSystemData.domain = typeof(originalSystemData.domain) == 'string' && originalSystemData.domain.trim().length > 0 && originalSystemData.domain.indexOf('.idf') > -1  ? originalSystemData.domain.trim().toLowerCase() : false;

// checks and adds (if neccesery) the validation parameters
    originalSystemData.status = typeof(originalSystemData.domain) == 'string' && ['good', 'bad', 'unknown'].indexOf(originalSystemData.status) > -1 ? originalSystemData.status : 'unknown';
    originalSystemData.bad = typeof(originalSystemData.bad) == 'object' && originalSystemData.bad instanceof Array && originalSystemData.bad.length > 0 ? originalSystemData.bad : [];
    originalSystemData.good = typeof(originalSystemData.good) == 'object' && originalSystemData.good instanceof Array && originalSystemData.good.length > 0 ? originalSystemData.good : [];

    if (originalSystemData.servers &&
    originalSystemData.system &&
    originalSystemData.domain &&
    originalSystemData.status &&
    originalSystemData.bad &&
    originalSystemData.good){
        workers.performCheck(originalSystemData);
    } else {
        debug("unable to check this system, skipping");
    }
};

// Setting the state to unknown if no servers in the system
workers.noServers = function(originalSystemData) {
    // Checks to see if all system data is valid except the servers
    originalSystemData = typeof(originalSystemData) == 'object' && originalSystemData !== null ? originalSystemData : {};
    originalSystemData.system = typeof(originalSystemData.system) == 'string' && originalSystemData.system.trim().length > 0 ? originalSystemData.system.trim().toLowerCase() : false;
    originalSystemData.domain = typeof(originalSystemData.domain) == 'string' && originalSystemData.domain.trim().length > 0 && originalSystemData.domain.indexOf('.idf') > -1  ? originalSystemData.domain.trim().toLowerCase() : false;
    originalSystemData.status = 'unknown';
    originalSystemData.servers = [];
    originalSystemData.good = [];
    originalSystemData.bad = [];

    if (originalSystemData.system && originalSystemData.domain && originalSystemData.status){
        // Writing the data back to the file
        var fullname = originalSystemData.system + '_' + originalSystemData.domain;
        fullname = fullname.replace(/\./g,'_');
        _data.read(fullname,function (err, data) {
            if (data) {

                if(data.servers.length > 0){
                    workers.validateAllChecks(data);
                } else {
                    _data.update(fullname, originalSystemData,function (err) {
                        if (err) {
                            debug(err);
                        }
                    });
                }
            } else {
                debug('Error, no system found!');
            }
        });
    } else {
        debug("Failed to set system to unknown!");
    }

};

// The actual server checker
workers.performCheck = function(originalSystemData) {
// Update the browser if data is changed.
    var serverStatusChange = false;
    var systemStatusChange = false;

// Starts checking the servers, for every server it update the status to good or bad
    var checkedServers = [];
    originalSystemData.servers.forEach(function (obj) {
        var target = obj + '.' + originalSystemData.domain;
        debug(target);
        var test = getTime(target);

// Tests if the time is good on the server, if good adds it to the good list of servers, if bad or unknown adds it to the bad
        // If the server is responsive and in the desired time field, remove it from the bad list and add to good
        if (typeof(test) == 'boolean' && test) {
            if (originalSystemData.good.indexOf(obj) < 0) {
                originalSystemData.good.push(obj);
                serverStatusChange = true;
                if (originalSystemData.bad.indexOf(obj) > -1) {
                    originalSystemData.bad.splice(originalSystemData.bad.indexOf(obj), 1);
                    debug('setting ' + obj + ' to good');
                }
            } else {
                if (originalSystemData.bad.indexOf(obj) > -1) {
                    originalSystemData.bad.splice(originalSystemData.bad.indexOf(obj), 1);
                    serverStatusChange = true;
                    debug('removed ' + obj + ' from bad because its good');
                }
            }
            // If the server is responsive and NOT in the desired time field, remove it from the good list and add to bad
        } else if (typeof(test) == 'boolean' && !test) {
            if (originalSystemData.bad.indexOf(obj) < 0) {
                originalSystemData.bad.push(obj);
                serverStatusChange = true;
                if (originalSystemData.good.indexOf(obj) > -1) {
                    originalSystemData.good.splice(originalSystemData.good.indexOf(obj), 1);
                    debug('removed '+obj+' because its bad');
                }
            } else {
                if (originalSystemData.good.indexOf(obj) > -1) {
                    originalSystemData.good.splice(originalSystemData.good.indexOf(obj), 1);
                    serverStatusChange = true;
                    debug('removed '+obj+' because its bad');
                }
            }
            // If the server is a resolvable name, remove it from the good and the bad lists
        } else if (test.Error == 'No host by this name was found!') {
            if (originalSystemData.good.indexOf(obj) > -1) {
                originalSystemData.good.splice(originalSystemData.good.indexOf(obj), 1);
                serverStatusChange = true;
            }
            if (originalSystemData.bad.indexOf(obj) > -1) {
                originalSystemData.bad.splice(originalSystemData.bad.indexOf(obj), 1);
                serverStatusChange = true;
            }
            // If the server is not one of the above, assume it is bad.
        } else {
            if (originalSystemData.bad.indexOf(obj) < 0) {
                originalSystemData.bad.push(obj);
                serverStatusChange = true;
                if (originalSystemData.good.indexOf(obj) > -1) {
                    originalSystemData.good.splice(originalSystemData.good.indexOf(obj), 1);
                    serverStatusChange = true;
                }
            } else {
                if (originalSystemData.good.indexOf(obj) > -1) {
                    originalSystemData.good.splice(originalSystemData.good.indexOf(obj), 1);
                    serverStatusChange = true;
                }
            }
            debug('error while getting the time!');
        }
    });

// After finishing all the servers, checking if any are bad, if so, set system state to bad, else system is good, if any server is not in good or bad, sets to unknown
    if (originalSystemData.servers.length != originalSystemData.good.length + originalSystemData.bad.length) {
        if (originalSystemData.status != 'unknown') {
            systemStatusChange = true;
            originalSystemData.status = 'unknown';
        }
    } else if (originalSystemData.bad.length > 0) {
        if (originalSystemData.status != 'bad') {
            systemStatusChange = true;
            originalSystemData.status = 'bad';
        }
    } else if (originalSystemData.good.length == originalSystemData.servers.length) {
        if (originalSystemData.status != 'good') {
            systemStatusChange = true;
            originalSystemData.status = 'good';
        }
    } else {
        if (originalSystemData.status != 'unknown') {
            systemStatusChange = true;
            originalSystemData.status = 'unknown';
        }
    }

// Writing the data back to the file
    var fullname = originalSystemData.system + '_' + originalSystemData.domain;
    fullname = fullname.replace(/\./g, '_');

// Checking if a change was made, if not, not writing
    if (systemStatusChange || serverStatusChange) {
        var dbg = {
            'systemStatus' : systemStatusChange,
            'serverStatus' : serverStatusChange
        };
        var timeOfCheck = helpers.fullTime();
        workers.log(fullname, originalSystemData.status, originalSystemData.servers, originalSystemData.good, originalSystemData.bad, timeOfCheck);
        _data.read(fullname, function (err, data) {
            if (data) {
                if (originalSystemData.servers.length == data.servers.length) {
                    _data.update(fullname, originalSystemData, function (err) {
                        if (err) {
                            debug(err);
                        }
                    });
                } else {
                    workers.validateAllChecks(data);
                }
            } else {
                debug('Error, no system found!');
            }
        });
    }
};


// Send check data to a log file
workers.log = function(fullname, status, serverList, goodList, badList, timeOfCheck){
    // Form the log data
    var logData = {
        'system' : fullname,
        'status' : status,
        'server list' : serverList,
        'good servers' : goodList,
        'bad server' : badList,
        'time' : timeOfCheck
    };

    // Convert the data to a string
    var logString = JSON.stringify(logData);

    // Determine the name of the log file
    var logFileName = fullname;

    // Append the log string to the file
    _logs.append(logFileName,logString,function(err){
        if(!err){
            debug("Logging to file succeeded");
        } else {
            debug("Logging to file failed");
        }
    });

};




// Timer to execute the worker-process once per minute
workers.loop = function(){
    setInterval(function(){
        workers.gatherAllChecks();
    },1000 * 60);
};


// Init workers
workers.init = function(){
// Check all the servers
    workers.gatherAllChecks();

// call the loop so it checks later on.
    workers.loop();



    // Compress all the logs immediately
    workers.rotateLogs();

    // Call the compression loop so checks will execute later on
    workers.logRotationLoop();
};

// Rotate (compress) the log files
workers.rotateLogs = function(){
    // List all the (non compressed) log files
    _logs.list(false,function(err,logs){
        if(!err && logs && logs.length > 0){
            logs.forEach(function(logName){
                // Compress the data to a different file
                var logId = logName.replace('.log','');
                var dateString = helpers.fullTime();
                var newFileId = logId+'-'+dateString;
                _logs.compress(logId,newFileId,function(err){
                    if(!err){
                        // Truncate the log
                        _logs.truncate(logId,function(err){
                            if(!err){
                                debug("Success truncating logfile");
                            } else {
                                debug("Error truncating logfile");
                            }
                        });
                    } else {
                        debug("Error compressing one of the log files.",err);
                    }
                });
            });
        } else {
            debug('Error: Could not find any logs to rotate');
        }
    });
};

// Timer to execute the log-rotation process once per day
workers.logRotationLoop = function(){
    setInterval(function(){
        workers.rotateLogs();
    },1000 * 60 * 60 * 24 * 7);
};





// Exports the worker object
module.exports = workers;