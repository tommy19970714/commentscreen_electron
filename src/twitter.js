const electron = require('electron')
const { BrowserWindow} = require('electron').remote
const auth = require('oauth-electron-twitter')
const Store = require('./store.js')
const Twitter = require('twitter')
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
    let userTokens = store.get('TwitterCredentials')
    if (userTokens) {
        // Twitter Already Authenticated
        console.log(userTokens)
    } else {
        // Authenticate Twitter
        let win = new BrowserWindow({
            webPreferences: {nodeIntegration: false}
        })
        auth.login(info, win).then(resultTokens => {
            store.set('TwitterCredentials', resultTokens)
            win.close()
        })
    }
}


const newWindowBtn = document.getElementById('auth-twitter')
newWindowBtn.addEventListener('click', (event) => {
    authTwitter()
})