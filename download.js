const fs = require('fs')
const path = require('path')
const {logger, request} = require('./settings')
const {read, update} = require('./DBOperator')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const downloader = imageInfo => {
  logger.info(`downloading ${imageInfo.imageUrl}`)
  return new Promise((res, rej) => {
    if (!fs.existsSync(imageInfo.postTitle)) {
      fs.mkdir(imageInfo.postTitle, err => {
        if (err) rej(err)
      })
    }
    request(imageInfo.imageUrl).then(buf => {
      fs.writeFile(imageInfo.postTitle + '/' + imageInfo.id + path.parse(imageInfo.imageUrl).ext, buf, err => {
        if (err) return rej(err)
        return res('done')
      })
    }).catch(e => rej(e))
  })
}

(async () => {
  try {
    let imageInfo
    while (imageInfo = await read()) {
      if (await downloader(imageInfo) === 'done') {
        const updateRes = await update(imageInfo.id, true)
        if (updateRes === 1) {
          logger.info(`download image ${imageInfo.id} successful`)
        } else {
          logger.warn('update res: ', updateRes)
        }
      }
    }
  } catch (e) {
    logger.error(e)
  }
})()