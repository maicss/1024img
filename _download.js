"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const _settings_1 = require("./_settings");
const DBOperator_1 = require("./DBOperator");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const downloader = (imageInfo) => {
    _settings_1.logger.info(`downloading ${imageInfo.imageUrl}`);
    return new Promise((res, rej) => {
        if (!fs.existsSync(imageInfo.postTitle)) {
            fs.mkdir(imageInfo.postTitle, (err) => {
                if (err)
                    rej(err);
            });
        }
        _settings_1.request(imageInfo.imageUrl).then(buf => {
            fs.writeFile(imageInfo.postTitle + '/' + imageInfo.id + path.parse(imageInfo.imageUrl).ext, buf, (err) => {
                if (err)
                    return rej(err);
                return res('done');
            });
        }).catch(e => rej(e));
    });
};
(async () => {
    try {
        let imageInfo;
        while (imageInfo = await DBOperator_1.read()) {
            if (await downloader(imageInfo) === 'done') {
                const updateRes = await DBOperator_1.update(imageInfo.id, true);
                if (updateRes === 1) {
                    _settings_1.logger.info(`download image ${imageInfo.id} successful`);
                }
                else {
                    _settings_1.logger.warn('update res: ', updateRes);
                }
            }
        }
    }
    catch (e) {
        _settings_1.logger.error(e);
    }
})();
//# sourceMappingURL=_download.js.map