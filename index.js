/*
 * Entry file for API
 *
 */


// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Instantiate the HTTP Server
const httpSrv = http.createServer((req, res) => {
  processReq(req, res);
});

// Start server
httpSrv.listen(config.httpPort, () => {
  console.log('The HTTP server is listening on port ' + config.httpPort);
});

// request, response server logic
let processReq = function(req, res){

  // Parse the url
  let parsedUrl = url.parse(req.url, true);
  
  // Get the path
  let trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  
  // Get the HTTP method
  let method = req.method.toLowerCase();
  
  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' && typeof(router[trimmedPath][method]) !== 'undefined' ?
      router[trimmedPath][method] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'method' : method,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      
      // Print some request data
      console.log("Request data (path, method, body): ", data.trimmedPath, data.method, data.payload);
      
      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ", statusCode, payloadString);

    });
  });
};

// Define all the handlers
let handlers = {};

// Hello post handler
handlers.hello = {}
handlers.hello.post = function(data, callback) {
  callback(200, {"message": "Hello from 'Homework Assignment #1' server"});
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404, {});
};

// Define the request router
let router = {
  'hello' : {
    'post': handlers.hello.post
  }
};
