"use strict";

var restify = require('restify');

var server = restify.createServer();

exports.server = server;

exports.start = function() {
	server.listen(8080, function() {
		console.log('%s listening at %s', server.name, server.url);
	});
};