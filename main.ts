import crawler from './Crawler'
import {logger} from "./settings"
import download from './ImageDownloader'

(async () => {
    try {
        await crawler()
        await download()
    } catch (e) {
        logger.error(e)
    }
})()