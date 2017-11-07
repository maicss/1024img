const _request = require('request')
const logger = require('tracer').colorConsole()

let {DBUrl} = require('./env')

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
  },
  'encoding': null,
}
let r = _request.defaults(options)

DBUrl = DBUrl || 'mongodb://localhost:27017/1024'

const ALL_PAGES = 1
const baseUrl = 'http://t66y.com/thread0806.php?fid=16&page='

const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1))

const request = url => {
  return new Promise((res, rej) => {
    r.get(url, (err, resp) => {
      if (err) return rej(err)
      res(resp.body)
    })
  })
}

const sleep = ms => {
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
