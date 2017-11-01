const request = require("axios");
const logger = require("tracer").colorConsole();


const options = {
    headers: {
        "Host": "t66y.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    },
    "encoding": null,
};
request.defaults.headers.common['Host'] = "t66y.com"
request.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"

// DB config

// const f = require('util').format;
// const user = encodeURIComponent('xxx');
// const password = encodeURIComponent('xxx');
// const authMechanism = 'DEFAULT';
//
// let url = f('mongodb://%s:%s@localhost:27017/1024?authMechanism=%s',
//     user, password, authMechanism);

let DBUrl = "mongodb://localhost:27017/1024";

const ALL_PAGES = 1;
const baseUrl = "http://t66y.com/thread0806.php?fid=16&page=";

const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1));

module.exports = {
    options,
    request,
    urls,
    logger,
};