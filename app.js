"use strict";

var trackedKeyword = require('config').Twitter.tracked_keyword;

var constants = require("./constants");

var mongoose = require("./mongoose");

var restify = require("./server");

var server = restify.server;

require("./services/tweet_count").routes(server, constants, trackedKeyword);

var root = constants.ROOT;

var TweetCount = require(root+"/models/tweet_count");

var io = require('socket.io')(server);

restify.start();



var twitter = require("./twitter");

var lastEmitTime = 0;

var throttlingDelay = 3000; // in miliseconds

twitter.connection.on('tweet', function (tweet) { 
	
	TweetCount.Class
	.where({
		user_id : tweet.user.id_str,
		tracked_keyword : trackedKeyword
	})
	.findOne(function (findErr, tweet_count) {
		
		if (findErr) {
			console.log(findErr);
	  	} else {
			
			if (tweet_count) {
	
				TweetCount.Class
				.where({_id:tweet_count._id})
				.update({ count : tweet_count.count + 1 },function(updateErr){
					if ( updateErr ) {
						console.log('Update Error', updateErr);
					}
				});
				
			} else {
				
				var data = {};
				data.user_id = tweet.user.id_str;
				data.tracked_keyword = trackedKeyword;
				data.count = 1;
				data.screen_name = tweet.user.screen_name;
				data.date_updated = new Date().getTime();
				data.date_created = new Date().getTime();
				
				var tweetCount = new TweetCount.Class(data);
				tweetCount.save(function (createErr) {
				  	if (createErr) {
						console.log('Create Error', createErr);
					}
				});
			}
		}
	});
	
	var currentTime = new Date().getTime();
	
	if ( throttlingDelay && currentTime >= lastEmitTime + throttlingDelay ) {
		TweetCount.getLeaderboard({
			tracked_keyword : trackedKeyword
		}, 10, function(err, items){
			io.emit('leaderboard', items);
			lastEmitTime = new Date().getTime();
		});
	}
})

twitter.connection.on('error', function (err) {
  console.log('twitter error');
  console.log(err);
})

twitter.connection.track(trackedKeyword);