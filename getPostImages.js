const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const {r, options, logger} = require('./settings');

async function getImagesFromPost(postInfo) {
    try {
        logger.info(`requesting post [${postInfo.url}] images url`);
        let htmlStream = await r(Object.assign(options, {url: postInfo.url}));
        let $ = cheerio.load(iconv.decode(htmlStream, 'GBK'));
        let inputs = $('input[type="image"]');
        postInfo.images = [];
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            postInfo.images.push($(input).attr('src'))
        }
        logger.info(`get post's [${postInfo.url}] images url successfully`);
        return postInfo

    } catch (e) {
        logger.error('getPostWithImage module error: ',  e.statusCode)
    }
}


// getImagesFromPost({url: 'http://t66y.com/htm_data/16/1706/24687sad53.html'}).then(a=> console.log(2, a)).catch(e => console.log(1, e));

module.exports = getImagesFromPost;