var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var interval;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});*/

io.on("connection", function (socket) {  
    // to make things interesting, have it send every second
    clearInterval(interval);
    interval = setInterval(function () {
        var msg = Date.now();
        io.sockets.emit("blink", msg);
        //var cor = msg % 65525;
        //console.log(cor);
    }, 2000);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});