const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const {request, logger} = require('./settings')

const forumPostList = async url => {
  logger.info(`requesting [${url}]`)
  await request(url)

  let $ = cheerio.load(iconv.decode(await request(url), 'GBK'))
  let trs = $('tr.tr3.t_one.tac')
  let posts = []
  for (let i = 0; i < trs.length; i++) {
    let tr = trs[i]
    let postTd = $(tr).find('td.tal')
    let url = postTd.find('a').attr('href')
    let postTitle, highlight=false;
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
module.exports = forumPostList

// forumPostList('http://t66y.com/thread0806.php?fid=16&search=&page=1').then(d => console.log(d)).catch(e => console.error(e))