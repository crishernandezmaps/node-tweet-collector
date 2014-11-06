"use strict";

exports.routes = function(server, constants, trackedKeyword) {

	var root = constants.ROOT;
		
	server.get('/tweet_count', function send(req, res, next) {
			
		var params = {
			tracked_keyword : trackedKeyword
		};
	
		var TweetCount = require(root+"/models/tweet_count");
		
		TweetCount.getLeaderboard(params, 5, function(err, items) {
			if (err) {
				res.send(403, err.errors);
			} else {
				res.send(items);
			}	
			return next();
		});
	});
}