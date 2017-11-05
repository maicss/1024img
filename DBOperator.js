const MongoClient = require('mongodb').MongoClient
const {DBUrl} = require('./settings')

/**
 * imageInfo Schema
 *
 *
 * */

async function save (singlePageInfo) {
  let db = await MongoClient.connect(DBUrl)
  return (await db.collection('1024Image').insertMany(singlePageInfo)).ops
}

const update = async (id, flag) => {
  const db = await MongoClient.connect(DBUrl)
  const imageInfo = await db.collection('1024Image').findOne({id})
  if (imageInfo) {
    imageInfo.hasDownloaded = flag
  } else {
    return 'no image find by id: ' + id
  }
  return (await db.collection('1024Image').findOneAndUpdate({id}, imageInfo)).ok
}

async function read () {
  const db = await MongoClient.connect(DBUrl)
  return await db.collection('1024Image').findOne({'hasDownloaded': false})
}

module.exports = {
  save,
  read,
  update
}

if (require.main === module) {
  const imageInfo = {
    postTitle: '[皇族搬运工]我不生产图片我只是图片的搬运工-还是比较有诱惑力的[10P]',
    postUrl: 'http://t66y.com/htm_data/16/1711/2752686.html',
    highlight: true,
    imageIndex: 1,
    imageUrl: 'http://www.s9tu.com/images/2017/10/19/6360be.jpg',
    date: '2017-11-05 14:33',
    id: '2752686I1',
    hasDownloaded: false
  };

  (async () => {
      // const saveRes = await save([imageInfo])
      const readRes = await read()
      // const updateRes = await update('2752686I2', true)
      // console.log(saveRes)
      console.log(readRes)
      // console.log(updateRes)
    }
  )()
}

