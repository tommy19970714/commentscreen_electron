const electron = require('electron');
const { app, BrowserWindow } = electron;
const utility = require('./utility');

var frontWindows = new Array();

exports.recieve = function (text) {
    for (var i in frontWindows) {
        console.log(frontWindows[i]);
        if (text.match(utility.emojiRanges)) {
            frontWindows[i].webContents.send('emoji', text);
        } else {
            frontWindows[i].webContents.send('comment', text);
        }
    }
}

function createFrontWindows() {
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
        // win.webContents.openDevTools();

        win.on('close', () => { win = null })
        win.loadFile('static/front.html');
        win.show();
        frontWindows.push(win);
    }
}

app.on('ready', createFrontWindows);
