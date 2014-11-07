"use strict";

var mongoose = require('mongoose');
	
var TweetCountSchema = mongoose.Schema({
	user_id:{
		type: String,
		unique: true	
	},
	screen_name:{
		type: String,
		unique: true
	},
	tracked_keyword:{
		type: String
	},
	count:{
		type: Number,
		default: 1,
		min: [0, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
	},
	date_created: {
		type: Date, 
		default: Date.now
	},
	date_updated: {
		type: Date, 
		default: Date.now
	}
});

// TweetCountSchema.path('temperature').validate(function(value){
// 	return ! isNaN(value);
// }, 'Invalid temperature');

var tweetCount = mongoose.model('TweetCount', TweetCountSchema);

exports.Class = tweetCount;

exports.getLeaderboard = function(params, limit, cb) {	
	tweetCount
		.find(params)
		.sort({count: -1, date_updated: -1})
		.limit(limit)
		.exec(cb);
}