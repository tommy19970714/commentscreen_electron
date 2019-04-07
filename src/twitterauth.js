const electron = require('electron')
const { BrowserWindow} = require('electron').remote
const auth = require('oauth-electron-twitter')
const Store = require('./store.js')
const Twitter = require('twitter')
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
        console.log('tokens found')
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

function getTwitterClient () {
    let twitterClient = new Twitter({
        consumer_key: info.key,
        consumer_secret: info.secret,
        access_token_key: userTokens.token,
        access_token_secret: userTokens.tokenSecret
    })
    return twitterClient
}

exports.start = function (tag ,handler) {
    let twitterClient = getTwitterClient()
    twitterClient.stream('statuses/filter', {track: tag}, (stream) => {
        stream.on('data', (event) => {
            console.log(event && event.text)
        })
        stream.on('error', (error)=> {
            throw error
        })
        handler(stream)
    })
}

exports.disconnect = function() {
    // socket.disconnect();
    console.log("disconnected");
}