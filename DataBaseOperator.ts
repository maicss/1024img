import {MongoClient} from 'mongodb'
import {mongoUrl, DBName} from './settings'
import {PostInfoWithImages} from "./Interfaces"

const save = async (singlePageInfo: PostInfoWithImages) => {
    let client = await MongoClient.connect(mongoUrl)
    return (await client.db(DBName).collection('1024Image').insertOne(singlePageInfo)).ops
}

const update = async (id: string, flag: boolean): Promise<number | Error> => {
    const client = await MongoClient.connect(mongoUrl)
    const imageInfo: PostInfoWithImages = await client.db(DBName).collection('1024Image').findOne({id})
    if (imageInfo) {
        imageInfo.downloaded = flag
    } else {
        return Error('no image find by id: ' + id)
    }
    return (await client.db(DBName).collection('1024Image').findOneAndUpdate({id}, imageInfo)).ok
}

async function read(): Promise<PostInfoWithImages> {
    const client = await MongoClient.connect(mongoUrl)
    let PostInfoWithImages = await client.db(DBName).collection('1024Image').findOne({})

}

export {
    save,
    read,
    update
}

read().then(d => console.log(d))
