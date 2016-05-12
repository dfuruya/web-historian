var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': ''
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  // fs.readFile( archive.paths.siteAssets + asset, (err, data) => {
  //   if (err) { 
  //     fs.readFile( archive.paths.archivedSites + asset, (err, data) => {
  //       if (err) { 
  //         exports.sendNotFound(res); 
  //       } else {
  //         exports.sendResponse(res, data, 200);
  //       }
  //     });
  //   } else {
  //     exports.sendResponse(res, data, 200);
  //   }
  // }); 
};

var mimeType = {
  // '.jpg': 'image/jpeg',
  // '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css',
  '.ico': 'image/x-icon'
};

exports.serveSite = function(res, url, thePath, status) {
  exports.headers['Content-Type'] = mimeType[path.extname(thePath)];
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

