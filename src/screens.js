const { BrowserWindow } = require('electron').remote

const electron = require('electron');

window.addEventListener('load', (event) => {

    var electronScreen = electron.screen;
    var displays = electronScreen.getAllDisplays();

    for (var i in displays) {
        // Create the browser window.
        let win = new BrowserWindow({
            x: displays[i].bounds.x,
            y: displays[i].bounds.y,
            height: displays[i].bounds.height,
            width: displays[i].bounds.width,
            transparent: true,
            frame: false,
            titleBarStyle: 'hidden',
            hasShadow: false,
            alwaysOnTop: true
        });

        win.setAlwaysOnTop(true, "screen-saver");
        win.setIgnoreMouseEvents(true);
        win.maximize();

        win.on('close', () => { win = null })
        win.loadURL('static/front.html');
        win.show();

        console.log("loaded");
    }
})