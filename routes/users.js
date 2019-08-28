var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../public/lib/util');

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//定义签名
const secret = 'miyao';
//生成token
const token = jwt.sign({
    name: 'joe',
}, secret, {
        expiresIn: 86400 //秒到期时间
    });

// 登录
router.get('/login', function (req, res, next) {
    var userInfo = req.query;
    let sql = `select *  from zhgd_user where account = ? `;
    //超管直接登录, 无需验证

    client.query(sql, [userInfo.userName], function (error, results, fields) {
        if (results.length > 0) {
            if (results[0].password == userInfo.password) {
                res.send({
                    status: '200',
                    data: {
                        userInfo: results[0],
                        token: token,
                    },
                    msg: '登陆成功!'
                });
            } else {
                res.send({
                    status: '400',
                    msg: '密码错误!'
                });
            }
        } else {
            res.send({
                status: '400',
                msg: '当前用户不存在!'
            });
        }

    })

});

router.get('/logout', function (req, res, next) {
    //  var userInfo = req.query;
    res.send(JSON.stringify(
        {
            status: '200',
            msg: '注销成功!'
        }
    ));
});


module.exports = router;