var http = require("http"),
    url = require("url"),
    // superagent = require("superagent"),
    superagent = require("superagent-charset"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy');

var ep = new eventproxy();
var model = require('./modelA');
var catchFirstUrl = 'http://www.cnblogs.com/',	//入口页面
    deleteRepeat = {},	//去重哈希数组
    urlsArray = [],	//存放爬取网址
    catchDate = [],	//存放爬取数据
    pageUrls = [],	//存放收集文章页面网站
    pageNum = 500,	//要爬取文章的页数
    startDate = new Date(),	//开始时间
    endDate = false;	//结束时间

for (var i = 1; i <= pageNum; i++) {
    pageUrls.push('https://daili.1688.com/page/list.htm?pageNum=' + i);
    // pageUrls.push('https://daili.1688.com/page/list.htm?spm=a26dk.7404697.0.0.drA9DT&stdcategoryid1=312&cname=%C6%B7%D6%CA%C4%DA%D2%C2&pageNum=' + i);
}

// 判断作者是否重复
function isRepeat(authorName) {
    if (deleteRepeat[authorName] == undefined) {
        deleteRepeat[authorName] = 1;
        return 0;
    } else if (deleteRepeat[authorName] == 1) {
        return 1;
    }
}

// 主start程序
function start(req, res) {
    // 轮询 所有文章列表页
    pageUrls.forEach(function (pageUrl) {
        superagent.get(pageUrl)
            .charset('gbk')
            .end(function (err, pres) {
                // console.log('fetch ' + pageUrl + ' successful');
                // res.write('fetch ' + pageUrl + ' successful<br/>');
                // 常规的错误处理
                if (err) {
                    console.log(err);
                }
                // pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
                // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
                // 剩下就都是 jquery 的内容了
                var $ = cheerio.load(pres.text, {decodeEntities: false});
                var curPageUrls = $('.section.fd-clr');
                for (var i = 0; i < curPageUrls.length; i++) {
                    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
                    var num = 1;
                    // var phoneNum =curPageUrls.eq(i).text();//手机号码
                    var name = curPageUrls.eq(i).children()[0].children[1].children[1].attribs.title;
                    var phoneNum = curPageUrls.eq(i).children()[1].children[3].children[1].children[7].children[1].children[0].data;
                    var flag = reg.test(phoneNum); //true
                    if( !isRepeat(phoneNum)){
                        if (flag) {
                            // res.write('fetch :' + name +':'+phoneNum + ' successful<br/>');
                            console.log(name, phoneNum);
                            model.create({
                                name: name,
                                phone: phoneNum,
                                date: Date.now(),
                                isTaobaoJiaMeng: false
                            }, function (err, doc) {
                                // if (err) return next(err);
                                // res.send(doc);
                            });
                        }
                    }

                }
            })
    })
}

module.exports = start;