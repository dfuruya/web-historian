var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) { throw err; }
    var urlArray = data.toString().split('\n');
    cb(urlArray);
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls( function (urlArr) {
    var urlFound = _.reduce(urlArr, function(trueSoFar, curr) {
      return trueSoFar || curr === url;
    }, false);
    cb(urlFound);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, (err) => {
    if (err) { throw err; }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) { throw err; }
    var found = _.reduce( files, function(trueSoFar, curr) {
      return trueSoFar || curr === url;
    }, false);
    callback(found);
  });
};

exports.downloadUrls = function(urlArray) {
  for (var url = 0; url < urlArray.length; url++) {
    var urlString = urlArray[url];
    exports.isUrlArchived(urlString, function(found) {
      if (!found) {
        var destination = exports.paths.archivedSites + '/' + urlString;
        request('http://' + urlString).pipe(fs.createWriteStream(destination));
      }
    });
  }
};
