#!/usr/bin/env node
//alternativly use express
function handleHTTP (req,res) {
	if (req.method === "GET") {
		if (/^\/\d+(?=$|[\/?#])/.test(req.url)) {
			req.addListener("end", function() {
				req.url = req.url.replace(/^\/(\d+).*$/,"/$1.html"); //replace ex. 6 to 6.html to serve static html
				static_files.serve(req,res);
			});
			req.resume();
		}
	  	else {
			res.writeHead(403);
			res.end("Forbbiden");
		}
	}
	else {
		res.writeHead(403);
		res.end("Forbbiden");
	}
}

function handleIO(socket) {
	function disconnect() {
		clearInterval(intv);
		console.log("client disconnected");
	}

	console.log("client connected");

	socket.on("disconnect", disconnect);

	var intv = setInterval(function(){
		socket.emit("hello", Math.random());
	},1000);
}

var hostname = '127.0.0.1';
var port = 3000;

var http = require("http");
var server = http.createServer(handleHTTP).listen(port,hostname);

var ASQ =  require("asynquence")
	
var node_static = require("node-static");

var static_files =  new node_static.Server(__dirname + "/public/html");

var io = require("socket.io").listen(server);

io.on("connection", handleIO);

//configure socket.io
io.configure(function() {
	io.enable("browser client minification");
	io.enable("browser client etag"); //apply etag caching
	io.set("log level", 1); //reduce logging
	io.set("transports", [
		"websocket",
		"xhr-polling",
		"jsonp-polling"
	]);
})