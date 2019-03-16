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
			req.url == "/jquery.js" ||
			req.url == "/node_modules/asynquence/asq.js" ||
			req.url == "/node_modules/asynquence-contrib/contrib.js" //||
			// req.url == "/h5ive.bundle.js"
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

function connection(socket) {
	var channel_id;

	function disconnect() {
		console.log("disconnected");
		//handles establishing direct connection to be on the same channel
		if (channel_id && channels[channel_id]) {
			for (var i=0; i<channels[channel_id].sockets.length; i++) {
				if (socket !== channels[channel_id].sockets[i]) {
					channels[channel_id].sockets[i].emit("disconnect");
				}
				channels[channel_id].sockets[i].leave("channel:" + channel_id);
				channels[channel_id].sockets[i] = null;
			}
			channels[channel_id] = null;
			channel_id = null;
		}
	}

	socket.on("disconnect",disconnect);

	socket.on("signal", function(msg) {
		socket.broadcast.emit(msg);
		console.log("signal");
	});

	// is there a channel waiting for a socket to join it?
	if (
		channels.length > 0 &&
		channels[channels.length-1] &&
		channels[channels.length-1].sockets.length === 1
	) {
		console.log("sockets joining channel: " + (channels.length-1));

		channels[channels.length-1].sockets.push(socket);

		// join both sockets to the channel
		for (var i=0; i<2; i++) {
			channels[channels.length-1].sockets[i].join("channel:" + channel_id);
		}

		// identify caller and receiver
		channels[channels.length-1].sockets[0].emit("identify",/*caller=*/true);
		channels[channels.length-1].sockets[1].emit("identify",/*caller=*/false);
	}
	// make a new channel
	else {
		channels[channels.length] = {
			sockets: [socket]
		};
	}

	// save this socket's channel_id
	channel_id = channels.length - 1;

	console.log("user assigned to channel: " + channel_id);
}

// navigator.getUserMedia = navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                          navigator.mozGetUserMedia;

// if (navigator.getUserMedia) {
//    navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
//       function(stream) {
//          var video = document.querySelector('video');
//          video.srcObject = stream;
//          video.onloadedmetadata = function(e) {
//            video.play();
//          };
//       },
//       function(err) {
//          console.log("The following error occurred: " + err.name);
//       }
//    );
// } else {
//    console.log("getUserMedia not supported");
// }


// navigator.getUserMedia = navigator.getUserMedia ||
//                          navigator.webkitGetUserMedia ||
//                          navigator.mozGetUserMedia;

// constraints = { audio: true, video: { width: 1280, height: 720 } }

// function handleSuccess(stream) {
//   const video = document.querySelector('video');
//   const videoTracks = stream.getVideoTracks();
//   console.log('Got stream with constraints:', constraints);
//   console.log(`Using video device: ${videoTracks[0].label}`);
//   window.stream = stream; // make variable available to browser console
//   video.srcObject = stream;
// }

// function handleError(error) {
//   if (error.name === 'ConstraintNotSatisfiedError') {
//     let v = constraints.video;
//     errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
//   } else if (error.name === 'PermissionDeniedError') {
//     errorMsg('Permissions have not been granted to use your camera and ' +
//       'microphone, you need to allow the page access to your devices in ' +
//       'order for the demo to work.');
//   }
//   errorMsg(`getUserMedia error: ${error.name}`, error);
// }

// function errorMsg(msg, error) {
//   const errorElement = document.querySelector('#errorMsg');
//   errorElement.innerHTML += `<p>${msg}</p>`;
//   if (typeof error !== 'undefined') {
//     console.error(error);
//   }
// }

// async function init(e) {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     handleSuccess(stream);
//     e.target.disabled = true;
//   } catch (e) {
//     handleError(e);
//   }
// }

// document.querySelector('#showVideo').addEventListener('click', e => init(e));

// navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 } })
// .then(function(stream) {
// 	var video = document.querySelector('video');
// 	video.srcObject = stream;
//     video.onloadedmetadata = function(e) {
//      	video.play();
//     };
// })
// .catch(function(err) {
// 	console.log("The following error occurred: " + err.name);
// });



var
	http = require("http"),
	httpserv = http.createServer(handleHTTP),

	port = 8006,
	host = "127.0.0.1",

	ASQ = require("asynquence"),
	node_static = require("node-static"),
	// static_files =  new node_static.Server(__dirname + "/public/html"),
	static_files =  new node_static.Server(__dirname),

	io = require("socket.io").listen(httpserv),

	channels = []
;

require("asynquence-contrib");


// configure socket.io
io.configure(function(){
	io.enable("browser client minification"); // send minified client
	io.enable("browser client etag"); // apply etag caching logic based on version number
	io.set("log level", 1); // reduce logging
	io.set("transports", [
		"websocket",
		"xhr-polling",
		"jsonp-polling"
	]);
});


httpserv.listen(port, host);

io.of("/rtc").on("connection",connection);
