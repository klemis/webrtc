const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io').listen(http);
const PORT = process.env.PORT || 5000

app.use(express.static('public'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// This callback function is called every time a socket tries to connect to the server
io.on('connection', function(socket) {
  console.log((new Date()) + ' Connection established.');
  // When a user send a SDP message broadcast to all users in the room
  socket.on('message', function(message) {
    console.log((new Date()) + ' Received Message, broadcasting: ' + message );
    socket.broadcast.emit('message', message);
  });
  // When the user hangs up  broadcast bye signal to all users in the room
  socket.on('disconnect', function() {
    console.log((new Date()) + ' Peer disconnected.');
    socket.broadcast.emit('user disconnected');
  });
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))