var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!
var url = require('url');
// var worker = require('../workers/htmlfetcher');

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
          http.sendNotFound(res);
        }
      });
    }
  },

  'POST': function(req, res) {
    var results = '';

    req.on('data', function(chunks) {
      results += chunks;
    });

    req.on('end', function() {
      var data = results.split('=')[1] + '\n';
      archive.isUrlInList(data, function(isInList) {
        if (!isInList) {
          archive.addUrlToList(data, function() {
            // worker.doWerk();
            http.sendResponse(res, 'Please come back when the site is downloaded!', 302);
          });
        } else {
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
