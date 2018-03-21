import {MongoClient} from 'mongodb'
import {mongoUrl, DBName} from './settings'
import {PostInfoWithImages} from "./Interfaces"

const save = async (singlePageInfo:PostInfoWithImages) => {
    let client = await MongoClient.connect(mongoUrl)
    return (await client.db(DBName).collection('1024Image').insertOne(singlePageInfo)).ops
}

const update = async (id:string, flag:boolean):Promise<number | Error > => {
    const client = await MongoClient.connect(mongoUrl)
    const imageInfo:PostInfoWithImages = await client.db(DBName).collection('1024Image').findOne({id})
    if (imageInfo) {
        imageInfo.downloaded = flag
    } else {
        return Error('no image find by id: ' + id)
    }
    return (await client.db(DBName).collection('1024Image').findOneAndUpdate({id}, imageInfo)).ok
}

async function read ():Promise<PostInfoWithImages> {
    const client = await MongoClient.connect(mongoUrl)
    return await client.db(DBName).collection('1024Image').findOne({'hasDownloaded': false})
}

export {
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

