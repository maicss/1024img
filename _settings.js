"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _request = require("request");
const aa_1 = require("./aa");
const r = _request.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    },
    encoding: null
});
const DBUrl = aa_1.DBUrl || 'mongodb://localhost:27017/1024';
exports.DBUrl = DBUrl;
const ALL_PAGES = 1;
const baseUrl = 'http://t66y.com/thread0806.php?fid=16&page=';
const urls = [...new Array(ALL_PAGES).keys()].map(i => baseUrl + (i + 1));
exports.urls = urls;
const sleep = (ms) => {
    return new Promise(rej => {
        setTimeout(rej, ms);
    });
};
exports.sleep = sleep;
const logger = require('tracer').colorConsole();
exports.logger = logger;
const request = (url) => {
    return new Promise((res, rej) => {
        r.get(url, (err, resp) => {
            if (err)
                return rej(err);
            res(resp.body);
        });
    });
};
exports.request = request;
//# sourceMappingURL=_settings.js.map