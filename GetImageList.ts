import * as iconv  from 'iconv-lite'
import * as cheerio from 'cheerio'
import * as path from 'path'

import {request, logger} from './settings'
import {PostInfo, SingleImage} from './Interfaces'

async function getImagesFromPost (postInfo: PostInfo) {
    const imageInfoList: SingleImage[]= []
    logger.info(`requesting post [${postInfo.postUrl}] images url`)
    let htmlStream = await request(postInfo.postUrl)
    let $ = cheerio.load(iconv.decode(htmlStream, 'GBK'))
    let inputs = $('input[type="image"]')
    for (let i = 0; i < inputs.length; i++) {
        const imageInfo = <SingleImage>{}
        imageInfo.url = $(inputs[i]).attr('src')
        imageInfo.index = i + 1
        imageInfo.id = path.parse(imageInfo.url).name + 'I' + (i + 1)
        imageInfo.downloaded = false
        imageInfo.retryTime = 0
        imageInfoList.push(imageInfo)
    }
    logger.info(`get post's [${postInfo.postUrl}] images url successfully`)
    return imageInfoList
}

// getImagesFromPost({url: 'http://t66y.com/htm_data/16/1803/3049624.html'}).then(a => console.log(a)).catch(e => console.log(1, e))

export default getImagesFromPost;