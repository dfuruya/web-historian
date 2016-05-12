var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!
var url = require('url');

var actions = {
	//should return the content of index.html
  'GET': function(req, res) { 

    if (req.url === '/') {
      http.serveSite(res, archive.paths.siteAssets, '/index.html');
    } else {
      console.log(req.url);
      if (req.url[0] === '/') {
        req.url = req.url.slice(1);
      }
      archive.isUrlInList(req.url, function(isInList) {
        console.log('>>>>>>>>>>>>>> isInList: ', isInList);
        if (isInList) {
          archive.isUrlArchived(req.url, function(isArchived) {
            if (isArchived) {
              console.log(archive.paths.archivedSites + '/' + req.url);
              http.serveSite(res, archive.paths.archivedSites, '/' + req.url);
            } else {
              http.serveSite(res, archive.paths.siteAssets, '/loading.html', 302);
            }
          });
        } else {
          http.sendNotFound(res);
        }
      });
    }
  },

  'POST': function(req, res) {

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