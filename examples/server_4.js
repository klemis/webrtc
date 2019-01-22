#!/usr/bin/env node
//alternativly use express
function handleHTTP (req,res) {
	if (req.method === "GET") {
		if (req.url === "/") {
			res.writeHead(200, {'Content-Type': 'text/plain'});
	  		res.write('Hello World ');
	  		res.end(Math.random().toString());
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