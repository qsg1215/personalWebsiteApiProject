var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

//引入
var jwt= require('jsonwebtoken');
var expressJwt = require('express-jwt');


var index = require('./routes/index');
var users = require('./routes/users');
var common = require('./routes/common');
var classify = require('./routes/classify');
var artical = require('./routes/artical');
var comment = require('./routes/comment');

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


app.use(expressJwt ({
    secret:  'miyao'
}).unless({
    path: ['/users/login','/common/getRSA','/artical/getArtical/']  //除了这些地址，其他的URL都需要验证
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
app.use(cors());



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
