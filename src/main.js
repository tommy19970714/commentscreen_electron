'use strict';

const electron = require('electron');
const {app, ipcMain, BrowserWindow, Menu, MenuItem} = electron;
require('./auto-update');

const socket = require('./mysocket');
const screens = require('./screens');
const Store = require('./store.js');
const twitter = require('./twitterstream.js');

const store = new Store({
  configName: 'CommentScreen',
  defaults: {
    TagName: ''
  }
});

function startSession(tag) {
  socket.start(tag, (text) => {
    screens.recieve(text);
    mainWindow.webContents.send('receive', text);
  });
  twitter.start(tag, (text) => {
    screens.recieve(text);
    mainWindow.webContents.send('receive', text);
  });
};

ipcMain.on('send', (event, text) => {
  socket.send(text);
  screens.recieve(text);
});

ipcMain.on('changeTag', (event, tagName) => {
  socket.disconnect();
  twitter.disconnect();
  startSession(tagName);
  store.set('TagName', tagName);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
app.commandLine.appendSwitch("ignore-certificate-errors");

function createWindow () {
  mainWindow = new BrowserWindow({ width: 520, height: 600 });
  mainWindow.loadFile('static/index.html');
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
  // mainWindow.webContents.openDevTools();
  mainWindow.webContents.once('dom-ready', () => {
    const tag = store.get('TagName');
    startSession(tag);
    mainWindow.webContents.send('setTag', tag);
    console.log("tagname: " + tag);
  });

  screens.createFrontWindows();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.