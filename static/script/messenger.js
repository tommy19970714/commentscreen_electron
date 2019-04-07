const { ipcRenderer } = require('electron');


//コメントのinput field
var input_filed = document.getElementById("input-comment");
var message_area = document.getElementById("messages-area");
var card_area = document.getElementById("card-area");
var tag = document.getElementById("tag-name");
var ua = navigator.userAgent;

ipcRenderer.on('setTag', (event, tagName) => {
    tag.value = tagName;
})

tag.addEventListener("change", function (event) {
    ipcRenderer.send('changeTag', tag.value);
    console.log("changed tag: " + tag.value);
});

input_filed.onfocus = function () {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
}

//コメントボタンが押されたら
function clickComment() {
    var text = input_filed.value;
    if (text.length != 0) {
        input_filed.value = "";
        ipcRenderer.send('send', text);
        appendSendMessage(text);
    }
}

function clickEmoji(text, tag) {
    ipcRenderer.send('send', text);
}

function appendSendMessage(text) {
    var messageDiv = document.createElement("div");
    messageDiv.setAttribute("class", "d-flex justify-content-end mb-4");
    messageDiv.innerHTML =
        `<div class="msg_cotainer_send">`
        + text +
        `<span class="msg_time_send">`
    + formatDate(new Date(), 'HH:mm') +
        `</span>
            </div>
        </div>`;
    message_area.appendChild(messageDiv);
}

function appendRecieveMessage(text) {
    var messageDiv = document.createElement("div");
    messageDiv.setAttribute("class", "d-flex justify-content-start mb-4");
    messageDiv.innerHTML =
        `<div class="msg_cotainer">`
        + text +
        `<span class="msg_time">`
        + formatDate(new Date(), 'HH:mm') +
        `</span>
            </div>
        </div>`;
    message_area.appendChild(messageDiv);
}


input_filed.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        clickComment();
    }
});

function formatDate(date, format) {
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    return format;
};