import crawler from './Crawler'
import {logger} from "./settings"
import download from './ImageDownloader'
import {read} from './DataBaseOperator'

// todo 主线程监控，下辖两个线程。一个抓url，一个下载图片，并具有重启子进程的功能
(async () => {
    try {
        if (await read()) {
            await download()
        } else {
            await crawler()
            await download()
        }
    } catch (e) {
        logger.error(e)
    }
})()