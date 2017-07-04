const MongoClient = require('mongodb').MongoClient;
const {DBUrl} = require('./settings');
// const f = require('util').format;
// const user = encodeURIComponent('blog');
// const password = encodeURIComponent('blog:test');
// const authMechanism = 'DEFAULT';
//
// let url = f('mongodb://%s:%s@localhost:27017/1024?authMechanism=%s',
//     user, password, authMechanism);

async function save(singlePageInfo) {
    let db = await MongoClient.connect(DBUrl);
    let r = await db.collection('dagaierTest').insertMany(singlePageInfo);
    console.log(r);
}

async function read() {
    const db = await MongoClient.connect(DBUrl);
    return await db.collection('dagaierTest').findOne({"hasDownloaded": {$exist: false}});
}

module.exports = {
    save,
    read
};

if (require.main === module) {
    const fs = require('fs');

    let data = JSON.parse(fs.readFileSync('./firstPage.json').toString());
    data = data.filter(d => !!d);
    console.log(data.length);
    save(data).catch(e => console.error(e));
}

