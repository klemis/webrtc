const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io').listen(http);
const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let clients = 0

// This callback function is called every time a socket tries to connect to the server
io.on('connection', function(socket) {
  console.log((new Date()) + ' Connection established.');
  socket.on('NewClient', function() {
    if(clients < 2) {
      if(clients == 1) {
        this.emit('CreatePeer')
      }
    }
    else
      this.emit('SessionAcive')
    clients++;
    console.log((new Date()) + ' Peer connected.');
  });
  socket.on('Offer', SendOffer)
  socket.on('Answer', SendAnswer)
  socket.on('disconect', Disconnect)

});

function Disconnect() {
  if (clients >0) {
    clients--
  }
}

function SendOffer(offer) {
  this.broadcast.emit('BackOffer', offer)
}

function SendAnswer(data) {
  this.broadcast.emit('BackAnswer', data)
}

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))