const electron = require('electron');

var url = "https://commentscreen.com/";
var socket = require('socket.io-client')(url);
socket.emit('join', { room: 'message' });

exports.start = function (handler) {
    socket.on('message', function (data) {
        console.log('Server: ' + data);
        const obj = JSON.parse(data);
        handler(obj.text);
    })
}

function makeJson(text) {
    return {
        position: "opt_ue",
        size: "opt_small",
        color: "#190707",
        text: text
    };
}

function sendSocket(array) {
    var jsonStr = JSON.stringify(array);
    socket.emit('message', jsonStr);
}