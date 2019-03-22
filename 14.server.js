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

const options = {
    key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
};

const https = require('https');
const fs = require('fs');

var
	http = require("http"),
	httpserv = http.createServer(options, handleHTTP),

	port = 8006,
	host = "192.168.0.101",
	node_static = require("node-static"),
	static_files = new node_static.Server(__dirname)
;

httpserv.listen(port, host);