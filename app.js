var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var moment = require('moment')

const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({ port: 3005 })

var timer = {};

function random(lower, upper) {
    return (Math.random() * (upper - lower + 1) + lower).toFixed(2);
}


// 服务器被客户端连接
wss.on('connection', (ws) => {
    // 通过 ws 对象，就可以获取到客户端发送过来的信息和主动推送信息给客户端
    ws.on('message', function incoming(message) {
        let projectId = JSON.parse(message).currentProjectId
        let sql = ` select * from zhgd_project where id = ?`

        client.query(sql, [projectId], function (error, results, fields) {
            if (!error) {
                client.query(`select * from zhgd_devices where id in  (${results[0].joinDeviceIds})`, [projectId], function (error, devices, fields) {
                    if (!error) {
                        results[0].devices = devices.map(item => {
                            item.liju = random(0, 100)
                            item.huizhuan = random(0, 360)
                            item.fudu = random(0, 30)
                            item.gaodu = random(5, 30)
                            item.fengsu = random(5, 6)
                            item.chuizhi = random(0, 90)
                            item.shuipin = random(-360, 360)

                            if (item.isOnLine == 1) {
                                item.runTime = moment().format('YYYY-MM-DD HH:mm:ss')
                            }

                            return item;
                        });


                        // res.send(
                        //     {
                        //         status: '200',
                        //         data: results[0],
                        //         msg: '操作成功!'
                        //     }
                        // );
                        clearInterval(timer)
                        ws.send(JSON.stringify(results[0]))

                        timer = setInterval(() => {
                            results[0].devices = devices.map(item => {

                                if (item.isOnLine == 1) {
                                    item.runTime = moment().format('YYYY-MM-DD HH:mm:ss')
                                    item.liju = random(0, 100)
                                    item.huizhuan = random(0, 360)
                                    item.fudu = random(0, 30)
                                    item.gaodu = random(5, 30)
                                    item.fengsu = random(5, 6)
                                    item.chuizhi = random(0, 90)
                                    item.shuipin = random(-360, 360)

                                }

                                return item;
                            });

                            ws.send(JSON.stringify(results[0]))
                        }, 3000)




                    }
                })

                // res.send(
                //     {
                //         status: '200',
                //         data: {
                //             dataList: results
                //         },
                //         msg: '操作成功!'
                //     }
                // );


            }
        })

    });




})

// 新建一个更新运行时间的定时任务

setInterval(() => {
    client.query(`update zhgd_devices set runTime = ? where isOnLine = "1" `, [moment().format('YYYY-MM-DD HH:mm:ss')], function (error, results, fields) {
        if (!error) {

        }
    })


}, 1000)




//引入
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


var index = require('./routes/index');
var users = require('./routes/users');
var common = require('./routes/common');
var classify = require('./routes/classify');
var artical = require('./routes/artical');
var comment = require('./routes/comment');
var zhgd = require('./routes/zhgd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressJwt({
    secret: 'miyao'
}).unless({
    path: ['/users/login', '/common/getRSA', '/artical/getArtical/']  //除了这些地址，其他的URL都需要验证
}));

app.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误
    if (err.name === 'UnauthorizedError') {
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.send(JSON.stringify({
            code: '401',
            msg: '登录已经失效!'
        }))
    }
});



app.use('/', index);
app.use('/users', users);
app.use('/common', common);
app.use('/classify', classify);
app.use('/artical', artical);
app.use('/comment', comment);
app.use('/zhgd', zhgd); //获取备案列表
app.use(cors());



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




module.exports = app;
