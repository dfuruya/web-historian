var archive = require('../helpers/archive-helpers');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
exports.doWerk = function() { archive.downloadUrls(); };

//add CRON functionality later
