import * as _request from 'superagent'

const logger = require('tracer').colorConsole()

const requestUA = 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'

const DBUrl = 'mongodb://localhost:27017/1024'

// 所有需要爬的页面，默认20页，也就是约180个帖子左右
const ALL_PAGES = 20
const baseUrl = 'http://t66y.com/thread0806.php?fid=16&page='

const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1))

const request = _request.set('User-Agent', requestUA)

const sleep = (ms: number): Promise<any> => {
    return new Promise(rej => {
        setTimeout(rej, ms)
    })
}

module.exports = {
    request,
    urls,
    logger,
    DBUrl,
    sleep
}