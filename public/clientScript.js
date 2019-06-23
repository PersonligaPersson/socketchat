$(function() {
    var socket = io();

    var typing = false;
    var timeout = undefined;

    document.addEventListener('keydown', function(event){
        if(event.key != 'Enter'){
            onKeyDownNotEnter();
        } else {
            submitMessage();
        }
    });

    document.getElementById('inputButton').addEventListener('click', submitMessage);

    function submitMessage(){
        socket.emit('chat message', $('#userInput').val());
        $('#userInput').val('');
    }

    /*
    $('form').submit(function(e){
        e.preventDefault(); //This prevents the submit to reload the page.
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    */

    socket.on('chat message', function(msg){        
        //$('#messages').append($('<li>').text(msg));
        //$('#messages').append($('<li>').append('<i class="fas fa-robot"></i>').append(msg)();
        //$('#messages').append('<i class="fas fa-robot"></i>').after($('<li>').text(msg));
        //$('#messages').append($('<li>').text(msg));
        var newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'messageDiv');
        var newContent = document.createTextNode(msg);
        var newP = document.createElement("p");
        newP.setAttribute('class', "messageText");
        newP.appendChild(newContent);
        var newIcon = document.createElement("i");
        newIcon.setAttribute('class', "fas fa-robot");
        newIcon.setAttribute('id', "robotIcon");
        newDiv.appendChild(newIcon);
        newDiv.appendChild(newP);
        $('#messages').append(newDiv);
    });

    socket.on('userIsTyping', function(data){
        $('#typingStatus').html(data);
    });

    socket.on('userNoLongerTyping', function(data){
        $('#typingStatus').html('');
    });

    function timeoutfunction(){
        typing = false;
        socket.emit('noLongerTypingMessage');
    }

    function onKeyDownNotEnter(){
        if(typing == false){
            typing = true;
            socket.emit('typingMessage');
            timeout = setTimeout(timeoutfunction, 500);
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutfunction, 500);
        }
    }
});