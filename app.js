var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var interval;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/admin', function(req, res){
  color = req.body.color;
  //res.writeHead(200);
  //res.end();
  //res.writeHead(200, {'Content-Type': 'text/html'});
  console.log(color);
  io.sockets.emit("newcolor", color);
  res.redirect('/admin');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

app.get('/health', function(req, res) {
    res.writeHead(200);
    res.end();
  });


/* ************************************************************* */


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

io.on('connection', function(socket){
  socket.on('nColor', function(msg){
    io.emit('newcolor', msg);
  });
});

io.on("connection", function (socket) {  
    // to make things interesting, have it send every 2 second
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



/* ************************************************************* */

/*http.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
*/
http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = http.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
