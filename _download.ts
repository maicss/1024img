const fs = require('fs')
const path = require('path')
import {logger, request, ImageInfo, Post} from './_settings'
import {read, update} from './DBOperator'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const downloader = (imageInfo:ImageInfo):Promise<Error|'done'> => {
    logger.info(`downloading ${imageInfo.imageUrl}`)
    return new Promise((res, rej) => {
        if (!fs.existsSync(imageInfo.postTitle)) {
            fs.mkdir(imageInfo.postTitle, (err:Error) => {
                if (err) rej(err)
            })
        }
        request(imageInfo.imageUrl).then(buf => {
            fs.writeFile(imageInfo.postTitle + '/' + imageInfo.id + path.parse(imageInfo.imageUrl).ext, buf, (err:Error) => {
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