const electron = require('electron')
const { BrowserWindow} = electron
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


function getTwitterClient () {
    let userTokens = store.get('TwitterCredentials')
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
    if (tag) {
        twitterClient.stream('statuses/filter', {track: tag}, (stream) => {
            stream.on('data', (event) => {
                // TODO: テキストを整理
                handler(event.text)
            })
            stream.on('error', (error)=> {
                throw error
                // console.log('error happened in twitter.start')
                // console.log(error)
            })
        })
    }
}

exports.disconnect = function() {
    socket.disconnect();
    console.log("disconnected");
}