"use strict";

var Twitter = require('node-tweet-stream');

var Config = require('config').Twitter;

var twitter = new Twitter({
    consumer_key: Config.consumer_key,
    consumer_secret: Config.consumer_secret,
    token: Config.token,
    token_secret: Config.token_secret
  })

exports.connection = twitter;