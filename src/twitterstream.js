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

let twitterStream

exports.start = function (tag ,handler) {
    let twitterClient = getTwitterClient()
    console.log(tag)
    if (tag) {
        twitterClient.stream('statuses/filter', {track: tag}, (stream) => {
            twitterStream = stream
            twitterStream.on('data', (tweet) => {
                // テキストを整理
                // ツイート本文に指定したtagが含まれている場合だけ処理する
                // ツイートがリプライの場合は取り除く
                // ツイートがリツイートの場合は取り除く
                if (tweet.text.indexOf(tag) >= 0 && !tweet.in_reply_to_status_id && !tweet.retweeted_status) {
                    handler(tweet.text)
                }
            })
            twitterStream.on('error', (error)=> {
                // 頻出すぎるキーワードを投げると420の原因になると思われる
                // https://twittercommunity.com/t/streaming-api-hits-420-very-often/14757/2
                console.log(error)
                handler('ざわざわ…')
            })
        })
    }
}

exports.disconnect = function() {
    twitterStream.destroy()
    console.log("twitter stream destroied");
}