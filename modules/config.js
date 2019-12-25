/*
*
*  Create and export the config variables
*
*/

// container for all environments
var environments = {};

// Staging (default) env
environments.prod = {
    'httpPort' : 80,
    'httpsPort' : 443,
    'envName' : 'prod',
    'hashingSecret' : 'ItHurtsWhenIP',
    'templateGlobals' : {
        'appName' : 'ClockWork Orange',
        'companyName' : 'ClockWork Orange Inc.',
        'yearCreated' : '2019',
        'baseUrl' : 'http://dsagitime001/'
    }
};

// Prod env
environments.staging = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'staging',
    'templateGlobals' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealCompany, Inc.',
        'yearCreated' : '2019',
        'baseUrl' : 'http://localhost:5000/'
    }
};

// Determine which env is passed
var currnetEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currnetEnvironment]) == 'object' ? environments[currnetEnvironment] : environments.prod;

// Export the module
module.exports = environmentToExport;