//var http = require('http');
var express = require('express');
var socket = require('socket.io');


var app = express.createServer(express.logger());

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

//var app = express.createServer(express.logger());

//var server = http.createServer(app).listen((process.env.PORT), function(){
//  console.log("Express server on)");
//});

var io = socket.listen(app);

app.get('/index.html', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/controller.html', function(req, res){
  res.sendfile(__dirname + '/controller.html');
});

app.get('/gyro.html', function(req, res){
  res.sendfile(__dirname + '/gyro.html');
});

app.get('/cordova-2.0.0.js', function(req, res){
  res.sendfile(__dirname + '/cordova-2.0.0.js');
});

var nextId = 0;
var display;
var sockets = [];

io.sockets.on('connection', function(socket){

  socket.on('init', function(data){
    if(data === 0){
      display = socket;
    }
    else{
      sockets[nextId] = socket;
      sockets[nextId].emit('ID', nextId);
      display.emit('newController', nextId);
      nextId++;
    }
  });

  socket.on('input', function(input){
    display.emit('update', input);
  });

  socket.on('disconnect', function(){
    var socketIndex = sockets.indexOf(socket);

    display.emit('destroy', socketIndex);
    console.log("DESTROY: " + socketIndex);
    sockets.splice(socketIndex, 1);
  });

});
