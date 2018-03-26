import {logger, sleep, urls} from './settings'
import GetPostList from './GetPostList'
import GetImageList from './GetImageList'
import {save} from './DataBaseOperator'
import {PostInfo, PostInfoWithImages, SingleImage} from "./Interfaces"

export default async () => {
    for (let url of urls) {
        try {
            const postList: PostInfo[] = await GetPostList(url)
            for (let post of postList) {
                await sleep(1000)
                try {
                    const imageList: SingleImage[] = await GetImageList(post)
                    if (imageList.length) {
                        let postInfo = <PostInfoWithImages>{
                            ...post,
                            images: imageList
                        }
                        await save(postInfo)
                    } else {
                        logger.warn(`post ${post.postUrl} get no images`)
                    }
                } catch (e) {
                    logger.error('Get post Image list error: ', e.code)
                }
            }
        } catch (e) {
            logger.error('Get forum post list error: ', e.code)
        }
    }
    return true
}