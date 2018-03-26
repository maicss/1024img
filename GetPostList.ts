import * as iconv from 'iconv-lite'
import * as cheerio from 'cheerio'
import {request, logger} from './settings'
import {PostInfo} from "./Interfaces"

export default async (url: string): Promise<PostInfo[]> => {
    logger.info(`requesting [${url}]`)
    let $ = cheerio.load(iconv.decode(await request(url), 'GBK'))
    let trs = $('tr.tr3.t_one.tac')
    let posts: PostInfo[] = []
    for (let i = 0; i < trs.length; i++) {
        let tr = trs[i]
        let postTd = $(tr).find('td.tal')
        let url = postTd.find('a').attr('href')
        let postName, highlight = false
        if (postTd.length) {
            if ($(postTd).has('font').length) {
                if ($(postTd).has('font[color="green"]').length) {
                    postName = $(postTd).find('font').text().trim()
                    highlight = true
                } else {
                    continue
                }
            } else {
                postName = $(postTd).find('h3 a').text().trim()
            }
            let poster = $(tr).find('a.f10')
            posts.push({
                highlight,
                postName,
                postTime: $(poster).text().trim(),
                postUrl: 'http://t66y.com/' + url,
            })
        }
    }
    logger.info(`parser [${url}] successfully`)
    return posts
}