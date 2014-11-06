"use strict";

var trackedKeyword = require('config').Twitter.tracked_keyword;

var constants = require("./constants");

var mongoose = require("./mongoose");

var restify = require("./server");

var server = restify.server;

require("./services/tweet_count").routes(server, constants, trackedKeyword);

restify.start();

var root = constants.ROOT;

var TweetCount = require(root+"/models/tweet_count");

var twitter = require("./twitter");


twitter.connection.on('tweet', function (tweet) { 
	
	var params = {
		user_id : tweet.user.id_str,
		tracked_keyword : trackedKeyword
	};

	TweetCount.Class
	.where(params)
	.findOne(function (findErr, tweet_count) {
		
		if (findErr) {
			console.log(findErr);
	  	} else {
			
			if (tweet_count) {
	
				TweetCount.Class
				.where({_id:tweet_count._id})
				.update({ count : tweet_count.count + 1 },function(updateErr){
					console.log(updateErr);
				});
				
			} else {
				
				var data = params;
				data.count = 1;
				data.screen_name = tweet.user.screen_name;
				data.date_updated = new Date().getTime();
				data.date_created = new Date().getTime();
				
				var tweetCount = new TweetCount.Class(data);
				tweetCount.save(function (createErr) {
				  	if (createErr) {
						console.log(createErr);
					}
				});
			}
		}
	});
})

twitter.connection.on('error', function (err) {
  console.log('twitter error');
  console.log(err);
})

twitter.connection.track(trackedKeyword);