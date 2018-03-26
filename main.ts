import crawler from './Crawler'
import {logger} from "./settings"
import download from './ImageDownloader'


// todo 以postUrl为key build index
// todo 爬取的时候先看有没有没下载的
// todo 做个CLI交互控制，分别下达盖尔和新时代
// todo 帖子名称的特殊符号处理
// todo 主线程监控，下辖两个线程。一个抓url，一个下载图片，并具有重启子进程的功能
(async () => {
    try {
        await crawler()
        await download()
    } catch (e) {
        logger.error(e)
    }
})()