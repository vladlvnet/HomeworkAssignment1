/*
 * Create and export configuration variables
 *
 */

// Container for all environments
let environments = {};

// Development (default) environment
environments.dev = {
  'httpPort' : 8000,
  //'httpsPort' : 8443,
  'envName' : 'development'
};

// Production environment
environments.production = {
  'httpPort' : 80,
  //'httpsPort' : 443,
  'envName' : 'production'
};

// Determine which environment was passed as a command-line argument
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

// Export the module
module.exports = environmentToExport;
