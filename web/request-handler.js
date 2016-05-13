var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!
var url = require('url');
var worker = require('../workers/htmlfetcher');

var actions = {
	//should return the content of index.html
  'GET': function(req, res) { 

    if (req.url === '/') {
      http.serveSite(res, archive.paths.siteAssets, '/index.html');
    } else {
      if (req.url[0] === '/') {
        req.url = req.url.slice(1);
      }
      archive.isUrlArchived(req.url, function(isArchived) {
        if (isArchived) {
          http.serveSite(res, archive.paths.archivedSites, '/' + req.url, 200);
        } else {
          // http.serveSite(res, archive.paths.siteAssets, '/loading.html', 302);
          http.sendNotFound(res);
        }
      });
    }
  },

  'POST': function(req, res) {
    // read req info
    var results = '';

    req.on('data', function(chunks) {
      results += chunks;
    });

    req.on('end', function() {
      var data = results.split('=')[1] + '\n';
      archive.isUrlInList(data, function(isInList) {
        // check list to see if it doesn't exist
        if (!isInList) {
          // add URL to list
          archive.addUrlToList(data, function() {
            // send URL to worker to be archived
            // worker.werk();
            // send response back
            http.sendResponse(res, 'Please come back when the site is downloaded!', 302);
          });
        // if it exists
        } else {
          // serve 
          http.sendNotFound(res);
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  action = actions[req.method];
  action(req, res);
};


    // invoke isUrlInList
      // callback --->>>>>> 
        // if false (url NOT in list)
          // send 404 response
        // if true (url is IN LIST)
          // check if exists in Archived folder
            // if it is, serve it up
            // otherwise redirect them to 302 loading.html
            //then serve it up when it's archived