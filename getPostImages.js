const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const path = require('path')

const {request, logger} = require('./settings')

async function getImagesFromPost (postInfo) {
  const imageInfos = []
  logger.info(`requesting post [${postInfo.postUrl}] images url`)
  let htmlStream = await request(postInfo.postUrl)
  let $ = cheerio.load(iconv.decode(htmlStream, 'GBK'))
  let inputs = $('input[type="image"]')
  for (let i = 0; i < inputs.length; i++) {
    const imageInfo = Object.assign({}, postInfo)
    imageInfo.imageUrl = $(inputs[i]).attr('src')
    imageInfo.imageIndex = i + 1
    imageInfo.id = path.parse(imageInfo.postUrl).name + 'I' + (i + 1)
    imageInfo.hasDownloaded = false
    imageInfos.push(imageInfo)
  }
  logger.info(`get post's [${postInfo.postUrl}] images url successfully`)
  return imageInfos
}

// getImagesFromPost({url: 'http://t66y.com/htm_data/16/1711/2717079.html'}).then(a => console.log(a)).catch(e => console.log(1, e))

module.exports = getImagesFromPost;