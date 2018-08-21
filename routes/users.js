var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../public/lib/util');

const jwt= require('jsonwebtoken');
const expressJwt = require('express-jwt');

//定义签名
const secret = 'miyao';
//生成token
const token = jwt.sign({
    name: 'joe',
}, secret, {
    expiresIn:  86400 //秒到期时间
});

// 登录
router.get('/login', function(req, res, next){
   var userInfo = req.query;
    if(userInfo.userName !== 'chen'){
        res.send(JSON.stringify(
            {status:'400',
                msg:'用户名错误!'}
        ));
        return;
    };
    if(userInfo.password !== '1215'){
        res.send(JSON.stringify(
            {status:'400',
                msg:'密码错误!'}
        ));
        return;
    };
    if(userInfo.userName == 'chen' && userInfo.password == '1215'){
        res.send(JSON.stringify(
            {status:'200',
             token:token,
             msg:'登陆成功!'}
            ));
        return;
    };
});

module.exports = router;