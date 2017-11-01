const {urls, logger} = require('./settings')
const fs = require('fs')
const util = require('util')

const writeFile = util.promisify(fs.writeFile)

const forumPostList = require('./getForumPostList')
const getImagesFromPost = require('./getPostImages')

const {save} = require('./DBOperator')

const sleep = async (ms) => {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}

async function mainTask (url) {
  let postList = await forumPostList(url)
  let allRequests = postList.map((postInfo, i) => {
    return new Promise((res, rej) => {
      let getImageTimer = setTimeout(() => {

        if (postInfo) {

          async function getSinglePostImage () {
            return res(await getImagesFromPost(postInfo))
          }

          getSinglePostImage().catch(e => logger.error(e))
        } else {
          clearTimeout(getImageTimer)
        }
      }, i * 5 * 1000)
    })
  })

  return Promise.all(allRequests).then(result => {
    return result
  }).catch(e => logger.error(e))

}

// let mainTimer = setInterval(() => {
//   let url = urls.pop()
//   if (url) {
//     mainTask(url)
//       .then(result => {
//         logger.log(result.length)
//         saveToDB(result)
//         writeFile('firstPage.json', JSON.stringify(result))
//           .then(logger.info('write file success'))
//           .catch(e => logger.error(e))
//       })
//       .catch(e => logger.error(e))
//   } else {
//     clearInterval(mainTimer)
//   }
//
// }, 5 * 1000)




