import * as fs from 'fs'
import * as path from 'path'
import {logger, request} from './settings'
import {read, update} from './DataBaseOperator'
import {PostInfoWithImages, SingleImage} from "./Interfaces"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const downloader = (imageInfo: SingleImage, dir: string): Promise<Error | 'done' | 'BadSuffix'> => {
    const imageSuffix = path.parse(imageInfo.url).ext
    if (['jpeg', 'png', 'jpg'].includes(imageSuffix)) return Promise.reject('BadSuffix')
    logger.info(`downloading ${imageInfo.url}`)
    if (!fs.existsSync(dir)) {
        fs.mkdir(dir, (err: Error) => {
            if (err) return Promise.reject(err)
            return request(imageInfo.url).then(buf => {
                fs.writeFile(dir + '/' + imageInfo.id + imageSuffix, buf, (err: Error) => {
                    if (err) return err
                    return 'done'
                })
            })
        })
    }

}

export default async () => {
        let postInfo:PostInfoWithImages
        while (postInfo = await read()) {
            for (let image of postInfo.images) {
                const downloadRes = await downloader(image, postInfo.postName)
                if (downloadRes === 'done') {
                    const updateRes = await update(postInfo.id, true)
                    if (updateRes === 1) {
                        logger.info(`download image ${postInfo.id} successful`)
                    } else {
                        logger.warn('update res: ', updateRes)
                    }
                } else if (downloadRes === 'BadSuffix') {
                    image.retryTime = 3
                } else {
                    // error
                    image.retryTime += 1
                    console.log(`download image ${image.url} error: ${downloadRes}, retry time: ${image.retryTime}.`)
                }
            }
        }
}
