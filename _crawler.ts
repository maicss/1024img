const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const path = require('path')
const {save} = require('./DBOperator');
import {logger, request, sleep, urls, Post, ImageInfo} from "./_settings"


const forumPostList = async (url: string) => {
    logger.info(`requesting [${url}]`)
    await request(url)

    let $ = cheerio.load(iconv.decode(await request(url), 'GBK'))
    let trs = $('tr.tr3.t_one.tac')
    const posts: Post[] = []
    for (let i = 0; i < trs.length; i++) {
        let tr = trs[i]
        let postTd = $(tr).find('td.tal')
        let url = postTd.find('a').attr('href')
        let postTitle, highlight = false;
        if (postTd.length) {
            if ($(postTd).has('font').length) {
                if ($(postTd).has('font[color="green"]').length) {
                    postTitle = $(postTd).find('font').text().trim();
                    highlight = true
                } else {
                    continue
                }
            } else {
                postTitle = $(postTd).find('h3 a').text().trim()
            }
            let poster = $(tr).find('a.f10')
            posts.push({
                highlight,
                postTitle,
                date: $(poster).text().trim(),
                postUrl: 'http://t66y.com/' + url,
            })
        }
    }
    logger.info(`parser [${url}] successfully`)
    return posts
}

async function getImagesFromPost(postInfo: Post) {
    const imageInfos: ImageInfo[] = []
    logger.info(`requesting post [${postInfo.postUrl}] images url`)
    let htmlStream = await request(postInfo.postUrl)
    let $ = cheerio.load(iconv.decode(htmlStream, 'GBK'))
    let inputs = $('input[type="image"]')
    for (let i = 0; i < inputs.length; i++) {
        const imageInfo: ImageInfo = Object.assign({
            imageUrl: $(inputs[i]).attr('src'),
            imageIndex: i + 1,
            id: path.parse(postInfo.postUrl).name + 'I' + (i + 1),
            hasDownloaded: false
        }, postInfo)
        imageInfos.push(imageInfo)
    }
    logger.info(`get post's [${postInfo.postUrl}] images url successfully`)
    return imageInfos
}

(async () => {
    try {
        for (let i = 0; i < urls.length; i++) {
            const postList = await forumPostList(urls[i])
            for (let j = 0; j < postList.length; j++) {
                await sleep(2000)
                const imageList = await getImagesFromPost(postList[j])
                if (imageList.length) {
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
