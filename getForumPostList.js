const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const {r, options, logger}  = require('./settings');

module.exports = async function forumPostList(url) {
    try {
        logger.info(`requesting [${url}]`);
        let htmlStream = await r(Object.assign(options, {url}));
        let $ = cheerio.load(iconv.decode(htmlStream, 'GBK'));
        let trs = $('tr.tr3.t_one.tac');
        let posts = [];
        for (let i = 0; i < trs.length; i++) {
            let tr = trs[i];
            let postTd = $(tr).find('td.tal');
            let url = postTd.find('a').attr('href');
            let postTitle;
            if (postTd.length) {
                if ($(postTd).has('font').length) {
                    if ($(postTd).has('font[color="green"]').length) {
                        postTitle = $(postTd).find('font').text().trim()
                    } else {
                        continue;
                    }
                } else {
                    postTitle = $(postTd).find('h3 a').text().trim()
                }
                let poster = $(tr).find('a.f10');
                posts.push({
                    postTitle,
                    postDate: $(poster).text(),
                    url: 'http://t66y.com/' + url,
                });
            }
        }
        logger.info(`parser [${url}] successfully`);
        return posts;

    } catch (e) {
        logger.error('getForumPostList module error: ', e.statusCode)
    }
};