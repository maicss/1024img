import {logger, sleep, urls} from './settings'
import getPostList from './GetPostList'
import getImageList from './GetImageList'
import {save} from './DataBaseOperator'
import {PostInfo, PostInfoWithImages} from "./Interfaces"

(async () => {
    try {
        for (let i = 0; i < urls.length; i++) {
            const postList = await getPostList(urls[i])
            for (let j = 0; j < postList.length; j++) {
                await sleep(2000)
                const imageList = await getImageList(postList[j])
                if (imageList.length){
                    const saveRes = await save(imageList)
                    console.assert(saveRes.length === imageList.length)
                } else {
                    logger.warn(`post ${postList[j]} get no images`)
                }
            }
        }
    } catch (e) {
        logger.error(e)
    }
})()

const crawler = async () => {

}
export{crawler}