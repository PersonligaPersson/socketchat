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

    function playAudio(){
        var audio = new Audio('ljud/pling.mp3');
        audio.play();
    }

    socket.on('chat message', function(msg, id){
        //console.log("Mottaget id: " + id + " Eget id: " + socket.id);        

        var newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'messageDiv');
        var newContent = document.createTextNode(msg);
        var newP = document.createElement("p");
        newP.setAttribute('class', "messageText");
        newP.appendChild(newContent);
        if(id != socket.id){
            newP.style.order = -1;
            playAudio();
        }
        var newIcon = document.createElement("i");
        newIcon.setAttribute('class', "fas fa-robot");
        newIcon.setAttribute('id', "robotIcon");
        newDiv.appendChild(newIcon);
        newDiv.appendChild(newP);

        $('#messages').append(newDiv);
        newDiv.scrollIntoView({block: "end", inline: "nearest", behavior: 'smooth'});
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