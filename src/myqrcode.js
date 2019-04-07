const electron = require('electron');
const { BrowserWindow } = require('electron').remote;

function openQRWindow() {
    let win = new BrowserWindow({
        width: 400, height: 400
    });
    win.on('close', () => { win = null })
    win.loadFile('static/qrcode.html');
    win.show();
}

const newWindowBtn = document.getElementById('qrcode');
newWindowBtn.addEventListener('click', (event) => {
    openQRWindow();
})