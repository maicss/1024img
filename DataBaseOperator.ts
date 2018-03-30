import {MongoClient} from 'mongodb'
import {mongoUrl, DBName, collectionName} from './settings'
import {PostInfoWithImages} from "./Interfaces"


(async () => {
    let client = await MongoClient.connect(mongoUrl)
    let collection = await client.db(DBName).collection(collectionName)
    if (!collection.indexExists('postUrl')) {
        console.warn('collection has no index')
        await collection.createIndex('postUrl', {unique: true})
    }
})()

const save = async (singlePageInfo: PostInfoWithImages) => {
    let client = await MongoClient.connect(mongoUrl)
    return (await client.db(DBName).collection(collectionName).insertOne(singlePageInfo)).ops
}

const update = async (postInfo: PostInfoWithImages): Promise<number | Error> => {
    const client = await MongoClient.connect(mongoUrl)
    return (await client.db(DBName).collection(collectionName).findOneAndUpdate({postUrl: postInfo.postUrl}, postInfo)).ok
}

async function read(): Promise<PostInfoWithImages> {
    const client = await MongoClient.connect(mongoUrl)
    return await client.db(DBName).collection(collectionName).findOne({done: {$ne: true}})
}

export {
    save,
    read,
    update
}
