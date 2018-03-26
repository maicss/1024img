# 1024img

> 闲着没事写的爬虫

主要爬两个页面，分别是[达盖尔的旗帜]和[新时代的我们]。

> 360浏览器有个功能，下载本页面所有图片，而且图片也能设置大小等规则，如果不是大批量的下载，这个够用了。使用我写的这个反而更麻烦，嗯嗯。chrome插件我没找。

## 项目进度

- [ x ] 基本功能完成
- [ x ] 达盖尔的旗帜 测试
- [ ] 新时代的我们 测试
- [ ] 数据库的读写

## 注

你们应该都知道这个爬虫是经过代理的，没有代理，你们就看代码好了😝


## 数据

返回的数据结构：可以直接看`Interfaces.ts`

```json
{
    "postName": " [原创][[cl分享团出品]xxx[19P]",
    "postTime": "2018-03-23 21:04",
    "postUrl": "http://t66y.com/htm_data/xxx.html",
    "highlight": true,
    "done": true,
    "images": [
        {
            "url": "http://s6tu.com/images/2018/03/11/xxx.jpg",
            "index": 1,
            "id": "96w6q01I1",
            "downloaded": false,
            "retryTime": 0
        }
    ]
}
```

## 其他

主要是想试试node的爬虫，和`async`&`await`的使用。

数据库不是必要的，但是也写了，用的`mongodb`。这个比较有趣，因为官方drive有ES6的教程，使用的是co，也就是generator，现在有了原生的`async`&`await`（其实还是generator）写起来更方便了。

现在（node8）也自带了`promisify`又省了一个库，爽。

大家选择node的原因无非是：

- 会javascript
- 基于事件的异步执行
- 轻量

但是这里主要的目的并不是爬虫，所以异步并发的反而不是优点，所以全是同步的操作~~开着坦克不能压坏路的感觉~~。其实这种场景用python，一个接一个的爬，什么也不用考虑，真的比node爽多了。

Happy watching~~~