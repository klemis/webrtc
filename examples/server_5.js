#!/usr/bin/env node
//alternativly use express
function handleHTTP (req,res) {
	if (req.method === "GET") {
		if (req.url === "/") {
			res.writeHead(200, {'Content-Type': 'text/plain'});

			ASQ(function(done) { 
		  		setTimeout(function() {
		  			done(Math.random());
				}, 1000);
			})
			.then(function(done,num) {
				setTimeout(function() {
		  			done('Hello World ' + num);
				}, 1000);
			})
			.val(function(msg) {
				res.end(msg)
			});
	  	}
	  	else {_
			res.writeHead(403);
			res.end("Forbbiden")
		}
	}
	else {_
		res.writeHead(403);
		res.end("Forbbiden")
	}
}

var hostname = '127.0.0.1';
var port = 3000;

var http = require('http');
var server = http.createServer(handleHTTP).listen(port,hostname);

var ASQ =  require("asynquence")