//   Copyright 2017 Mark Val
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

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
