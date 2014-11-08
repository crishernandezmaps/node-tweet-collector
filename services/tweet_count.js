"use strict";

exports.routes = function(server, constants, trackedKeyword) {

	var root = constants.ROOT;
		
	server.get('/tweet_count', function send(req, res, next) {	
		res.header('Access-Control-Allow-Origin', req.headers.origin);
			
		var params = {
			tracked_keyword : trackedKeyword
		};
	
		var TweetCount = require(root+"/models/tweet_count");
		
		TweetCount.getLeaderboard(params, 10, function(err, items) {
			if (err) {
				res.send(403, err.errors);
			} else {
				res.send(items);
			}	
			return next();
		});
	});
}