"use strict";

exports.routes = function(server, constants, trackedKeyword) {

	var root = constants.ROOT;
		
	server.get('/tweet_count', function send(req, res, next) {	
		res.header('Access-Control-Allow-Origin', req.headers.origin);
			
		var params = {
			tracked_keyword : trackedKeyword
		};
	
		var sort = {
			// count: -1, 
			date_updated: -1
		}
	
		var TweetCount = require(root+"/models/tweet_count");
		
		TweetCount.getLeaderboard(params, 10, sort, function(err, items) {
			if (err) {
				res.send(403, err.errors);
			} else {
				res.send(items);
			}	
			return next();
		});
	});
}