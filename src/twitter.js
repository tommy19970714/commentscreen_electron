const electron = require('electron')
const { app, BrowserWindow} = require('electron').remote
const auth = require('oauth-electron-twitter')
const Store = require('./store.js')
require('dotenv').config()

const store = new Store({
    configName: 'CommentScreenTwitterAuth',
    defaults: {
        Credentials: {}
    }
})

let info = {
    key: process.env.TWITTER_APP_TOKEN,
    secret: process.env.TWITTER_APP_SECRET,
}

function authTwitter () {
    let win = new BrowserWindow({
        webPreferences: {nodeIntegration: false}
    })
    auth.login(info, win).then(result => {
        store.set('TwitterCredentials', result)
        win.close()
    })
    console.log('Credentials:')
    console.log(store.get('TwitterCredentials'))
}


const newWindowBtn = document.getElementById('auth-twitter')
newWindowBtn.addEventListener('click', (event) => {
    console.log(Store)
    authTwitter()
})