import * as iconv  from 'iconv-lite'
import * as cheerio from 'cheerio'
import * as path from 'path'

import {request, logger} from './settings'
import {PostInfo, SingleImage} from './Interfaces'

export default async (postInfo: PostInfo): Promise<SingleImage[]> =>  {
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
