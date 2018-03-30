import * as fs from 'fs'
import * as path from 'path'
import {logger, request} from './settings'
import {read, update} from './DataBaseOperator'
import {PostInfoWithImages, SingleImage} from "./Interfaces"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const downloader = async (imageInfo: SingleImage, distDirName: string, dir: string): Promise<string> => {
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
    let postInfo: PostInfoWithImages
    while (postInfo = await read()) {
        if (!fs.existsSync(postInfo.forum)) {
            fs.mkdir(postInfo.forum, (err: Error) => {
                if (err) return Promise.reject(err)
            })
        }
        logger.info(`start download ${postInfo.postName}`)
        // 过滤出没有下载的图片
        const notDownLoadImages = postInfo.images.filter(image => !image.downloaded)
        for (let image of notDownLoadImages) {
            try {
                const downloadRes = await downloader(image, postInfo.forum, postInfo.postName)
                if (downloadRes === 'done') {
                    image.downloaded = true
                    logger.info(`download ${image.url} successful.`)
                } else if (downloadRes === 'BadSuffix') {
                    image.retryTime = 3
                    logger.error(`${image.url} has a BadSuffix`)
                }
            } catch (e) {
                image.retryTime += 1
                logger.error('download image failed, cause: ', e.message)
            }
        }

        if (postInfo.images.filter(image => !image.downloaded).length === 0) {
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
