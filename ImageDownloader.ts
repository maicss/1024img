import * as fs from 'fs'
import * as path from 'path'
import {logger, request, distDirName} from './settings'
import {read, update} from './DataBaseOperator'
import {PostInfoWithImages, SingleImage} from "./Interfaces"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const downloader = async (imageInfo: SingleImage, dir: string): Promise<string> => {
    const imageSuffix = path.parse(imageInfo.url).ext
    if (!['.jpeg', '.png', '.jpg', '.JPG', 'JPEG', '.PNG'].includes(imageSuffix)) return 'BadSuffix'
    logger.info(`downloading ${imageInfo.url}`)
    if (!fs.existsSync(distDirName + '/' + dir)) {
        fs.mkdirSync(distDirName + '/' + dir)
    }
    let imageBuffer = await request(imageInfo.url)
    fs.writeFileSync(distDirName + '/' + dir + '/' + imageInfo.id + imageSuffix, imageBuffer)
    return 'done'
}

export default async () => {
    if (!fs.existsSync(distDirName)) {
        fs.mkdir(distDirName, (err: Error) => {
            if (err) return Promise.reject(err)
        })
    }
    let postInfo: PostInfoWithImages
    while (postInfo = await read()) {
        // 过滤出没有下载的图片
        const notDownLoadImages = postInfo.images.filter(image => !image.downloaded && image.retryTime !== 3)
        for (let image of notDownLoadImages) {
            try {
                const downloadRes = await downloader(image, postInfo.postName)
                if (downloadRes === 'done') {
                    image.downloaded = true
                    logger.info(`download ${image.url} successful.`)
                } else if (downloadRes === 'BadSuffix') {
                    image.retryTime = 3
                    logger.error(`${image.url} has a BadSuffix`)
                } else {
                    // error
                    image.retryTime += 1
                    logger.info(`download image ${image.url} error: ${downloadRes}, retry time: ${image.retryTime}.`)
                }
            } catch (e) {
                if (e.code === 'ETIMEDOUT') {
                    image.retryTime += 1
                }
                logger.error('download image failed, cause: ', e)
            }
        }

        if (postInfo.images.filter(image => !image.downloaded && image.retryTime !== 3).length === 0) {
            postInfo.done = true
        }
        const updateRes = await update(postInfo)
        if (updateRes === 1) {
            logger.info(`update post: ${postInfo.postName} successful`)
        } else {
            logger.warn(`update post ${postInfo.postName} failed: , ${updateRes}`)
        }
    }
}
