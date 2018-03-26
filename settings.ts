import * as r from 'request'

const logger = require('tracer').colorConsole()

const _request = r.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    },
    encoding: null,
    timeout: 10 * 1000
})
const mongoUrl = 'mongodb://localhost:27017/'
const DBName = '1024'
const collectionName = '1024Image'

// 所有需要爬的页面，默认20页，也就是180个帖子左右
const ALL_PAGES = 20
const baseUrl = 'http://t66y.com/thread0806.php?fid=16&page='

const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1))


const sleep = (ms: number): Promise<any> => {
    return new Promise(rej => {
        setTimeout(rej, ms)
    })
}

const request = (url:string):Promise<Buffer> => {
    return new Promise((res, rej) => {
        try {
            _request.get(url, (err, resp) => {
                if (err) return rej(err)
                res(resp.body)
            })
        } catch (e) {
            return Promise.reject(e)
        }
    })
}

const distDirName = 'Images'

export {
    request,
    urls,
    logger,
    mongoUrl,
    sleep,
    DBName,
    distDirName,
    collectionName
}