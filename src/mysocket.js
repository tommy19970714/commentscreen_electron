const electron = require('electron');

var url = "https://commentscreen.com/";
var socket;

exports.start = function (tag ,handler) {
    socket = require('socket.io-client')(url);
    socket.emit('join', { room: tag });
    socket.on('message', function (data) {
        console.log('Server: ' + data);
        const obj = JSON.parse(data);
        handler(obj.text);
    });
    console.log("connected: " + tag);
}

exports.disconnect = function() {
    socket.disconnect();
    console.log("disconnected");
}

exports.send = function (text) {
    const array = makeJson(text);
    var jsonStr = JSON.stringify(array);
    socket.emit('message', jsonStr);
}

function makeJson(text) {
    return {
        position: "opt_ue",
        size: "opt_small",
        color: "#190707",
        text: text
    };
}
