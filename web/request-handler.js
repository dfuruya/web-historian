var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var returnFileText = function(res, thePath, url){
	fs.readFile( thePath + url, (err, data) => {
		if(err) throw err;
		res.writeHead(200, http.headers);
		res.end(data);
	});	
}


var actions = {
	//should return the content of index.html
	'GET': function(req, res) { 

		if(req.url === '/'){
           returnFileText(res, archive.paths.siteAssets, '/index.html');
	    }

	}
}


exports.handleRequest = function (req, res) {
  action = actions[req.method];
  action(req, res);


};

