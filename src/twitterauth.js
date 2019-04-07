// Twitter Authentication
// Authenticate and stores user secret tokens
const electron = require('electron')
const { BrowserWindow} = electron.remote
const auth = require('oauth-electron-twitter')
const Store = require('./store.js')
require('dotenv').config()

const store = new Store({
    configName: 'CommentScreen',
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
        console.log('Tokens found. Already Authenticated.')
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
