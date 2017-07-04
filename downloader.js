const fs = require('fs');
const util = require('util');
const request = require('request-promise');
const MongoClient = require('mongodb').MongoClient;
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const mkdir = util.promisify(fs.mkdir);

const {read} = require('./DBOperator');

const {DBUrl, r, options} = require('./settings');

/*
 * 默认:
 * 文件是一个论坛页面一个文件的，这样一个文件是一个小于等于100的Array
 * 数据库就是每次读取一个咯
 *
 */

// from db

// async function downloader() {
//     let db = await MongoClient.connect(DBUrl);
//     let postInfo = await db.collection('dagaier').findOne({hasDownloaded: {$exists: false}});
//     let mkdirSuccess = await mkdir(postInfo.postTitle);
//     if (mkdirSuccess === undefined) {
//         postInfo.images.forEach(imgUrl => {
//             let buf = await request.get()
//         })
//     }
// }

async function test() {
    console.log(await r(Object.assign(options, {url: 'https://segmentfault.com/img/remote/1460000006923363?w=723&h=296'})))
}

test().catch(e=>console.error(e));

