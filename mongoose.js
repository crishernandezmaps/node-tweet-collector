"use strict";

var mongoose = require('mongoose');

var Config = require('config').Database;

mongoose.connect('mongodb://' + Config.Host + '/' + Config.Name);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
	console.log('connceted successfully');
});

exports.db = db;