const electron = require('electron')
const { app, BrowserWindow} = require('electron').remote
const auth = require('oauth-electron-twitter')
const Store = require('./store.js')
require('dotenv').config()


let info = {
    key: process.env.TWITTER_APP_TOKEN,
    secret: process.env.TWITTER_APP_SECRET,
}

// app.on('ready', () => {
// })

function authTwitter () {
    console.log('aaa')
    console.log(info)
    let win = new BrowserWindow({
        webPreferences: {nodeIntegration: false}
    })
    console.log(win)
    console.log(app.getPath('userData'))
    auth.login(info, win).then(result => {
        console.log(result)
    })
}


const newWindowBtn = document.getElementById('auth-twitter')
newWindowBtn.addEventListener('click', (event) => {
    console.log(Store)
    authTwitter()
})