var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs');
var path = require('path')
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'k1xvbf3whcZycfvmLNuupaVJ1ZxffVftZPrThgrK';
qiniu.conf.SECRET_KEY = 'Qr2Fx1-s2pYQKy0GBXM8fw-VtUE8fAjegOaDQJKj';

// 获取RSA
router.all('/getRSA', function (req, res, next) {
    if (req.method === "POST") {
        var param = req.body;
    } else {
        var param = req.query || req.params;
    };
    fs.readFile(path.join(__dirname, "../RSA/rsa_public_key.pem"), 'utf-8', function (err, data) {
        if (err) {
            throw (err)
        } else {
            res.send(JSON.stringify({
                status: '200',
                data: {
                    RSApublicKey: data
                },
                msg: '访问成功!'
            }));
        }
    });
});

// 获取七牛token
router.all('/qiniu', function (req, res, next) {
    var mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KEY)
    var options = {
        scope: 'img-database',
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
        expires: 86400 * 2,
        callbackUrl: 'https://www.myitsky.com/common/uploadImage/callback',
        callbackBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
        callbackBodyType: 'application/json'
    }
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    res.send(JSON.stringify({
        status: '200',
        data: {
            token: uploadToken
        },
        msg: '访问成功!'
    }));
});

// 获取七牛token
router.all('/gitHook', function (req, res, next) {
    res.send(JSON.stringify({
        status: '200',
        data: {
            token: req.body
        },
        msg: '访问成功!'
    }));
});

// 图片上传回调

router.all('/uploadImage/callback', function (req, res, next) {
    console.log(req, '请求回调')
    res.send(JSON.stringify({
        status: '200',
        data: {
            req: req.body
        },
        msg: '访问成功!'
    }));
});

module.exports = router;