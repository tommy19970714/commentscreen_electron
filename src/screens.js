const electron = require('electron');
const { BrowserWindow } = electron;
const utility = require('./utility');

var frontWindows = new Array();

exports.recieve = function (text) {
    for (var i in frontWindows) {
        console.log(frontWindows[i]);
        if (text.match(utility.emojiRanges) && text.length <= 3) {
            frontWindows[i].webContents.send('emoji', text);
        } else {
            frontWindows[i].webContents.send('comment', text);
        }
    }
}

exports.closeFrontWindows = function () {
    for (var i in frontWindows) {
        frontWindows[i].close();
    }
    frontWindows = new Array();
}

exports.createFrontWindows = function () {
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
            closable: true,
            titleBarStyle: 'hidden',
            hasShadow: false,
            alwaysOnTop: true,
            minimizable: false,
            maximizable: false,
            focusable: false,
            skipTaskbar: true,
            titleBarStyle: "customButtonsOnHover"
        });

        win.setAlwaysOnTop(true, "screen-saver");
        win.setVisibleOnAllWorkspaces(true);
        win.setIgnoreMouseEvents(true);
        win.maximize();
        // win.webContents.openDevTools();

        win.loadFile('static/front.html');
        win.show();
        frontWindows.push(win);
    }
}

exports.getFrontWindowsLength = function () {
    // for debug
    return frontWindows.length
}