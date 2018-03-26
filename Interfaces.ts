
interface PostInfo {
    postName: string
    postTime: string
    postUrl: string
    highlight: boolean
    done?: boolean
}

interface SingleImage {
    url: string
    index: number
    id: string
    downloaded: boolean
    retryTime: number
}

interface PostInfoWithImages extends PostInfo, SingleImage{
    images: [SingleImage]
}

export {
    PostInfo,
    SingleImage,
    PostInfoWithImages
}

