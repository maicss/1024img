import {logger, sleep, urls} from './settings'
import GetPostList from './GetPostList'
import GetImageList from './GetImageList'
import {save} from './DataBaseOperator'
import {PostInfo, PostInfoWithImages, SingleImage} from "./Interfaces"

export default async () => {
    for (let url of  urls) {
        const postList: PostInfo[] = await GetPostList(url)
        for (let post of postList) {
            await sleep(2000)
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
        }
    }
    return true
}