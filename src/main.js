'use strict';

const electron = require('electron');
const {app, ipcMain, BrowserWindow, Menu, MenuItem} = electron;
const { is } = require('electron-util');
const Store = require('electron-store');
const store = new Store()
require('./auto-update');

const socket = require('./mysocket');
const screens = require('./screens');
const twitter = require('./twitterstream');


// Menu template
const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://commentscreen.com/') }
        }
      ]
    }
  ]
  
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
            label: 'Preferences',
            accelerator: 'Cmd+,', 
            click () { openSettingsWindow() }
        },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { 
             role: 'quit',
             accelerator: 'Cmd+Q', 
        }
      ]
    })
  
    // 編集メニュー
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )
  
    // ウインドウメニュー
    template[2].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }


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
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    quit();
  })
  mainWindow.webContents.once('dom-ready', () => {
    const tag = store.get('TagName');
    startSession(tag);
    mainWindow.webContents.send('setTag', tag);
    console.log("tagname: " + tag);
  });

  screens.createFrontWindows();
  electron.screen.on('display-added', renewFrontWindows);
  electron.screen.on('display-removed', renewFrontWindows);
  electron.screen.on('display-metrics-changed', renewFrontWindows);

  // Menu
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This function exists in settings.js too
function openSettingsWindow() {
    let win = new BrowserWindow({
        width: 320, height: 360
    });
    win.on('close', () => { win = null })
    win.loadFile('static/settings.html');
    win.show();
}

function renewFrontWindows() {
  console.log("renew windows");
  screens.closeFrontWindows();
  screens.createFrontWindows();
}

function quit() {
  if (!is.macos) {
    app.quit();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  quit();
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