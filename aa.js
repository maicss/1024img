const request = require('axios')
const fs = require('fs')
const iconv = require('iconv-lite')
request({
  method:'get',
  url:'https://cn.bing.com',
  responseType:'stream'
})
  .then(function(response) {
    console.log(response.data)
    console.log(iconv.decode(response.data._readableState.ReadableState.buffer, 'GBK'))
  });

aa = ['_readableState',
  'readable',
  'domain',
  '_events',
  '_eventsCount',
  '_maxListeners',
  'socket',
  'connection',
  'httpVersionMajor',
  'httpVersionMinor',
  'httpVersion',
  'complete',
  'headers',
  'rawHeaders',
  'trailers',
  'rawTrailers',
  'upgrade',
  'url',
  'method',
  'statusCode',
  'statusMessage',
  'client',
  '_consuming',
  '_dumped',
  'req',
  'responseUrl']