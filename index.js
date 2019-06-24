var express = require('express'); //Getting the express module.
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    console.log('User: ' + socket.id + ' connected to the server.');
    socket.broadcast.emit('chat message', "A new user has connected to the chat.");

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function(){
        console.log('User: ' + socket.id + ' disconnected from the server.');
    });

    socket.on('typingMessage', function(){
        socket.broadcast.emit('userIsTyping', 'A user is typing...');
    });

    socket.on('noLongerTypingMessage', function(){
        socket.broadcast.emit('userNoLongerTyping', '');
    })
})

http.listen(3000, function(){
    console.log('listening on *3000');
});