/**
 * @file 开发环境服务端
 * @author etoile(lyetoile@126.com)
 */

/* eslint-disable no-console */

'use strict';

require('./check-versions')();
const config = require('../config');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');

// 默认调试服务器端口
let port = process.env.PORT || config.dev.port;

// 启动调试服务器时是否自动打开浏览器，默认为 false
let autoOpenBrowser = !!config.dev.autoOpenBrowser;

let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: function () {}
});

let appData = require('../data.json');
let d3Data = require('../d3.json');
let direction = appData.direction,
    generics = appData.generics,
    course = appData.course,
    news = appData.new,
    user = appData.user,
    style = appData.style,
    generic = appData.generic,
    courseDetail = appData.courseDetail,
    chapter = appData.chapter,
    courseAdd = appData.courseAdd,
    discusion = appData.discusion,
    danmaku1 = appData.danmakuData,
    study = appData.study,
    collection = appData.collection,
    history = appData.history,
    note = appData.note,
    danmakuPost = appData.danmakuPost,
    lessonDetail = appData.lessonDetail,
    discusionDetail = appData.discusionDetail,
    msg = appData.msg;
let apiRoutes = express.Router();
apiRoutes.param('id', function(req, res, next, id) {
    next();
});

// 根据方向获取分类
apiRoutes.get('/direction/:id', function(req, res) {
    res.json({
        failure: [],
        success: generic.success
    });
    res.end();
});



// 获取所有课程分类
apiRoutes.get('/generic', function(req, res) {
    res.json({
        failure: [],
        success: generics.success
    });
});

// 检索功能
apiRoutes.get('/course/commendations/:params', function(req, res) {
    res.json({
        failure: [],
        success: course.success,
        total:20
    });
});

// 获取最新课程
apiRoutes.get('/course/new', function(req, res) {
    res.json({
        failure: [],
        success: news.success
    });
});

// 获取最热课程
apiRoutes.get('/course/hot', function(req, res) {
    res.json({
        failure: [],
        success: news.success
    });
});

// 获取个人详细信息
apiRoutes.get('/user', function(req, res) {
    res.json({
        failure: [],
        success: user.success
    });
});

// 获取所有方向
apiRoutes.get('/direction', function(req, res) {
    res.json({
        failure: [],
        success: direction.success
    });
});

// 获取所有课程类型
apiRoutes.get('/style', function(req, res) {
    res.json({
        failure: [],
        success: style.success
    });
});

// 根据课程类别获取课程类型
apiRoutes.get('/generic/:generic_id', function(req, res) {
    res.json({
        failure: [],
        success: generic.success
    });
});

// 获取课程详情
apiRoutes.get('/course/:c_id', function(req, res) {
    res.json({
        failure: [],
        success: courseDetail.success
    });
});

// 获取章节
apiRoutes.get('/course/:c_id/section', function(req, res) {
    res.json({
        failure: [],
        success: chapter.success
    });
});

// 加入课程
apiRoutes.get('/course/add/:c_id', function(req, res) {
    res.json({
        failure: [],
        success: courseAdd.success
    });
});
app.use('/', apiRoutes);

// 发表主题帖
apiRoutes.post('/discuss/publish', function(req, res) {
    console.log(req.params)
    console.log(req.body)
    res.json({
        code:true
    });
});

// 获取讨论区数据
apiRoutes.get('/discuss/:course_id/course/:type', function(req, res) {
    console.log(req.params)
    res.json({
        failure: [],
        success: discusion.success,
        total:20
    });
});

// 弹幕数据
apiRoutes.get('/danmaku/:id', function(req, res) {
    res.json({
        code: 1,
        danmaku: danmaku1.danmaku
    });
});

apiRoutes.post('/danmaku/:id', function(req, res) {
    res.json({
        code:1,
        danmaku:danmakuPost.data
    });
});

// 我的学习
apiRoutes.get('/user/study', function(req, res) {
    res.json({
        failure: [],
        success: study.success,
        total:study.total
    });
});

// 我的收藏

apiRoutes.get('/user/collection', function(req, res) {
    res.json({
        failure: [],
        success: collection.success
    });
});

// 观看历史

apiRoutes.get('/user/history', function(req, res) {
    res.json({
        failure: [],
        success: history.success,
        total: history.total
    });
});

// 我的笔记
apiRoutes.get('/discuss/:type', function(req, res) {
    res.json({
        failure: [],
        success: note.success,
        total: note.total
    });
});

// 我的消息
apiRoutes.get('/news/:type', function(req, res) {
    res.json({
        failure: [],
        success: msg.success
    });
});

// 课时详情
apiRoutes.get('/lesson/:lesson_id', function(req, res) {
    res.json({
        failure: [],
        success: lessonDetail.success,
        next:2
    });
});

// 划重点/有疑问数据
apiRoutes.get('/discuss/:lesson_id/lesson/:type', function(req, res) {
    res.json({
        failure: [],
        success: discusionDetail.success
    });
});

// 收藏课程
apiRoutes.post('/collection/:id', function(req, res) {
    res.json({
        failure: [],
        success: true
    });
});

// 收藏课程
apiRoutes.get('/d3', function(req, res) {
    res.json(d3Data);
});

app.use('/', apiRoutes);


// 当 html-webpack-plugin 的模版文件更新的时候，强制重新刷新调试页面
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        });
        cb();
    });
});

// 指定需要代理的请求列表
let proxyTable = config.dev.proxyTable;

// 代理请求
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = {
            target: options
        };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// 处理 history API 的回退情况（如果在线上环境中，也需要服务器做相应处理）
app.use(require('connect-history-api-fallback')());

// 服务器部署 webpack 打包的静态资源
app.use(devMiddleware);

// 使用热更新， 如果编译出现错误会实时展示编译错误
app.use(hotMiddleware);

// 纯静态资源服务
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

let uri = 'http://localhost:' + port;

let newResolve;
let readyPromise = new Promise(function (resolve) {
    newResolve = resolve;
});

console.log('> Starting dev server...');

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n');

    // 当测试环境下，不需要打开浏览器
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }
    newResolve();
});

let server = app.listen(port);

module.exports = {
    ready: readyPromise,
    close: function () {
        server.close();
    }
};
