const electron = require('electron');
const { BrowserWindow } = electron.remote;

function openSettingsWindow() {
    let win = new BrowserWindow({
        width: 320, height: 440
    });
    win.on('close', () => { win = null })
    win.loadFile('static/settings.html');
    win.show();
}

const newWindowBtn = document.getElementById('settings');
newWindowBtn.addEventListener('click', (event) => {
    openSettingsWindow();
})