function handleHTTP(req,res) {
	if (req.method == "GET") {
		if (/^\/\d+(?=$|[\/?#])/.test(req.url)) {
			req.addListener("end",function(){
				req.url = req.url.replace(/^\/(\d+).*$/,"/$1.html");
				static_files.serve(req,res);
			});
			req.resume();
		}
		else if (
			req.url == "/public/js/jquery.js" ||
			req.url == "/public/js/peer_connection.js"
		) {
			req.addListener("end",function(){
				static_files.serve(req,res);
			});
			req.resume();
		}
		else {
			res.writeHead(403);
			res.end();
		}
	}
	else {
		res.writeHead(403);
		res.end();
	}
}

// https stuff
const https = require('https');
const fs = require('fs');

// const options = {
//     key: fs.readFileSync('./ssl/privatekey.pem'),
//     cert: fs.readFileSync('./ssl/certificate.pem')
// };

var
	http = require("http"),
	httpserv = http.createServer(handleHTTP),
	// httpserv = http.createServer(options, handleHTTP),

	port = 5000,
	host = "localhost",
	node_static = require("node-static"),
	static_files = new node_static.Server(__dirname)
;

httpserv.listen(port, host);