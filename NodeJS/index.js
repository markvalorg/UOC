/**
 * Created by mvall on 2017-01-25.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { path: '/socket.io'});
var querystring = require('querystring');

var qs = require('querystring');

app.get('/', function(req, res){

    res.sendFile(__dirname + '/pages/index.html');
});

app.post('/api', function(req, res){
    var post = qs.parse(body);
    var body = '';
    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });
    req.on('end', function () {
        var post  = qs.parse(body);
        io.emit('UOC message', post);

        /*
        // Used to debug what is passed from Unity
        //
        Object.keys(post).forEach(function(key) {
            var val = querystring.unescape(post[key]);
            console.log(key+"  : "+val);
        });
        */


    });
    res.send("complete"); // TODO: Add status code and error handling
});
app.use('/imgs', express.static(__dirname + '/pages/imgs'));

io.on('connection', function(socket){
    console.log('a user connected');
    var userId ;
    var d;
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('chat message', 'user disconnected');
    });
    /*
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });*/
    socket.on('UOC', function(data){
        var d = new Date();
        console.log(d.toLocaleTimeString()+' : ' +querystring.unescape(data.log));
        console.log(querystring.unescape(data.stackTrace));
        io.emit('chat message', data);
        userId = data.ComputerName;
    });
    io.emit('chat message', 'a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});