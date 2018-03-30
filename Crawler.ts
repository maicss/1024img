import {logger, sleep, urlMap} from './settings'
import GetPostList from './GetPostList'
import GetImageList from './GetImageList'
import {save} from './DataBaseOperator'
import {PostInfo, PostInfoWithImages, SingleImage} from "./Interfaces"

export default async () => {
    for (let forum in urlMap) {
        let urls = urlMap[forum]
        for (let url of urls) {
            const postList: PostInfo[] = await GetPostList(url, forum)
            for (let post of postList) {
                await sleep(1000)
                const imageList: SingleImage[] = await GetImageList(post)
                if (imageList.length) {
                    let postInfo = <PostInfoWithImages>{
                        ...post,
                        images: imageList,
                        forum
                    }
                    await save(postInfo)
                } else {
                    logger.warn(`post ${post.postUrl} get no images`)
                }
            }
        }
    }
    return true
}