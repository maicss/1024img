const fs = require('fs')
const path = require('path')
const {logger, sleep, request} = require('./settings')
const {read, update} = require('./DBOperator')

const downloader = imageInfo => {
  logger.info(`downloading ${imageInfo.imageUrl}`)
  return new Promise((res, rej) => {
    if (!fs.existsSync(imageInfo.postTitle)) {
      fs.mkdir(imageInfo.postTitle, err => {
        if (err) rej(err)
      })
    }
    request(imageInfo.imageUrl).then(buf => {
      fs.writeFile(imageInfo.postTitle + '/' + imageInfo.id + '.' + path.parse(imageInfo.imageUrl).ext, buf, err => {
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
          await sleep(1000)
          logger.info(`download image ${imageInfo.imageUrl} successful`)
        } else {
          logger.warn('update res: ', updateRes)
        }
      }
    }
  } catch (e) {
    logger.error(e)
  }
})()