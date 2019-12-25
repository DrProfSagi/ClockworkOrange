/*
*
*  This includes all the time functions, mainly getting the current time on a @target server.
*  The function run the cmd command in a syncronic way and returns the current time to the parseTime function/
*
 */

// Dependencies
var util = require('util');
var debug = util.debuglog('getTime');

// Imports the builtIn child_process module, spacificly the spawnSync part.
var sync = require('child_process').spawnSync;

// Defines the regular expression that query only the date.
var regex = /^\d\d:\d\d:\d\d/g;

// The function that runs the CMD command on a @target server, and returns it to the function as a string.
function timeQuery(target) {
// Gets the time info from target server
    var command = sync('w32tm', ['/stripchart','/computer:' + target, '/dataonly', '/samples:1']);
    return command.stdout.toString();
};

// The data modification part, this part actually process the string from the timeQuery function, and extract only the time part
function parseTime(target) {
    var output = timeQuery(target);
    var timeData = '';
    var difference = '';
    //var servertime = '';

    // Checks to see if there is an error code in the shell command.
    if(output.indexOf('error:') > -1) {
        output = output.split('error: ')[1].trim();
        if (output == '0x800705B4' ) {
            timeData = {'error' : 'NTP request failed'};
            debug('NTP request failed');
        } else {
            timeData = {'error': 'could not query server time. error code: ' + output};
            debug('Could not query server time, error code: ' + output);
        }
    } else if (output.indexOf('The following error occurred: No such host is known.') > -1) {
        timeData = {'Error' : 'No host by this name was found!'};
        debug('failed to find host '+ target);
    } else {
// get only the difference in time from the server!
        difference = output.split(', ')[1].trim();

// Calculate how big the time difference is, if it is grater then 270 seconds (4.5 minutes), it consider the time to be wrong.
        var regdif1 = /^\D/g;
        var regdif2 = /\..*/g;
        difference = difference.replace(regdif1,'').replace(regdif2,'');
        timeData = parseInt(difference) > 270 ? false : true;

    }

 // remove all the additional data from the time line
    return timeData;
};

module.exports = parseTime;