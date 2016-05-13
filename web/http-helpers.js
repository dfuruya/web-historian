var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.serveSite = function(res, url, thePath, status) {
  fs.readFile(url + thePath, (err, data) => {
    if (err) {
      exports.sendNotFound(res);
    } else {
      exports.sendResponse(res, data, status);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!

exports.sendResponse = function (response, data, status) {
  status = status || 200;
  response.writeHead(status, exports.headers);
  response.end(data);
};

exports.sendNotFound = function (response) {
  exports.sendResponse(response, 'Error 404 Not Found', 404);
};

