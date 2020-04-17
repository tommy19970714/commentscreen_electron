const electron = require('electron')
const { BrowserWindow} = electron
const auth = require('oauth-electron-twitter')
const Store = require('electron-store')
const store = new Store()
const Twitter = require('twitter')
const { token, secret } = require('./env.js')


let info = {
    key: token,
    secret: secret,
}


function getTwitterClient () {
    let userTokens = store.get('TwitterCredentials')
    if (userTokens) {
        let twitterClient = new Twitter({
            consumer_key: info.key,
            consumer_secret: info.secret,
            access_token_key: userTokens.token,
            access_token_secret: userTokens.tokenSecret
        })
        return twitterClient
    } else {
        return null
    }
}

let twitterStream

exports.start = function (tag ,handler) {
    if (tag) {
        let twitterClient = getTwitterClient()
        if (!twitterClient) {
            // ログイン状態に関わらずmain.jsはスタートを呼ぶため、
            // 認証が保存されていない＝認証していないユーザーに対しては
            // TwitterStreamを取得しない。ユーザが利用したくない場合もあるため。
            return null
        }
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
    if (twitterStream) {
        twitterStream.destroy()
    }
    console.log("twitter stream destroied");
}