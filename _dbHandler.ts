import {MongoClient} from 'mongodb'
import {DBUrl, Post, ImageInfo} from './_settings'

const save = async (pageInfos:Post[]):Promise<Array<Post>> => {
    let db = await MongoClient.connect(DBUrl)
    return (await db.collection('1024Image').insertMany(pageInfos)).ops
};

const update = async (id:string, flag:boolean):Promise<number|string> => {
    const db = await MongoClient.connect(DBUrl)
    const imageInfo = await db.collection('1024Image').findOne({id})
    if (imageInfo) {
        imageInfo.hasDownloaded = flag
    } else {
        return 'no image find by id: ' + id
    }
    return (await db.collection('1024Image').findOneAndUpdate({id}, imageInfo)).ok
}

async function read ():Promise<Post> {
    const db = await MongoClient.connect(DBUrl)
    return await db.collection('1024Image').findOne({'hasDownloaded': false})
}

module.exports = {
    save,
    read,
    update
}
// todo 测试自带的忽略重复项存储是怎么样的行为
/**
 * 如果需要每天爬一次，需要：
 * todo 创建一个以ID为key的index
 * todo 添加重试下载机制
 */
if (require.main === module) {
    const imageInfo:ImageInfo = {
        postTitle: '我不生产图片我只是图片的搬运工',
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

