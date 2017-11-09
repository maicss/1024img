import * as _request from 'request'
import {DBUrl as _DBUrl} from './aa'

const r = _request.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    },
    encoding: null
});

const DBUrl = _DBUrl || 'mongodb://localhost:27017/1024'

const ALL_PAGES = 1
const baseUrl = 'http://t66y.com/thread0806.php?fid=16&page='

const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1))

const sleep = (ms:number):Promise<number> => {
    return new Promise(rej => {
        setTimeout(rej, ms)
    })
};

interface Post {
    highlight: boolean,
    postTitle: string,
    date: string,
    postUrl: string,
}

interface ImageInfo extends Post {
    imageUrl: string,
    imageIndex: number,
    id: string,
    hasDownloaded: boolean
}

const logger = require('tracer').colorConsole()

const request = (url:string):Promise<ReadableStream> => {
    return new Promise((res, rej) => {
      r.get(url, (err, resp) => {
        if (err) return rej(err)
        res(resp.body)
      })
    })
  }
  
export {request, sleep, urls, DBUrl, logger, Post, ImageInfo}

