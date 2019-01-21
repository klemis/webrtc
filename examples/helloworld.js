function say(filename,cb) {
/**
 *	 	Reading a file from filesystem, and added timeout
 *   	to simulate response for an answer from server.
 *		module is esported outside to use in other files as a "say"
 */
	return content = fs.readFile(filename, function(err, content){
		if (err) {
			cb(err);
		}
		else {
			setTimeout(function(){
				cb(null,content);
			},1000);
		}
	});
}

var fs = require("fs");

module.exports.say = say;