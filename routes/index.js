var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path')
var NodeRSA =  require ('node-rsa');
var util = require('../public/lib/util');
var uuid  = require('node-uuid');
//定义全局的iD生成器
global.uuid = uuid;

var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var client  = mysql.createPool( dbConfig.mysql );
//定义全局的iD生成器
global.client = client;
router.all('/*', function(req, res, next) {
    //定义全局的RSA解密方法
    global.decryptRSAData = function (req) {
        if (req.method === "POST") {
            var param = req.body;
        } else{
            var param = req.query || req.params;
        };
        var rsa_aes_private_key =     fs.readFileSync(path.join(__dirname, "../RSA/rsa_private_key.pem"), 'utf-8');
        privatekey= new NodeRSA(rsa_aes_private_key,'pkcs1-sha256');
        var aesData = privatekey.decrypt(req.headers.aeskey, 'utf8');
        var  aesData = JSON.parse(aesData);
        var key =JSON.parse(JSON.parse(aesData).key);
        var iv  =JSON.parse(JSON.parse(aesData).iv);
        if(JSON.stringify(param) !== '{}'){
            var params =   util.decryption(param[0],key,iv);
            return JSON.parse(params);
        }





    };
    //定义全局的RSA加密方法
    global.encryptRSAData = function (data) {
        if (req.method === "POST") {
            var param = req.body;
        } else{
            var param = req.query || req.params;
        };
        var rsa_aes_private_key =     fs.readFileSync(path.join(__dirname, "../RSA/rsa_private_key.pem"), 'utf-8');
        privatekey= new NodeRSA(rsa_aes_private_key,'pkcs1-sha256');
        var aesData = privatekey.decrypt(req.headers.aeskey, 'utf8');
        var  aesData = JSON.parse(aesData);
        var key =JSON.parse(JSON.parse(aesData).key);
        var iv  =JSON.parse(JSON.parse(aesData).iv);
        var data = JSON.stringify(JSON.stringify(data))
        return  util.encryption(data,key,iv)
    };

    //定义全局的非空检查
    global.checkNullKey = function (data) {
            function checkDataIsHasErrorParm(data) {
                for ( var key in data){
                    if(typeof data[key] != 'object' &&  data[key] !== null  ){
                        if(data[key] === undefined || data[key] === '' || (typeof data[key] == 'string' &&  data[key].trim().length == 0)){
                            res.send(JSON.stringify({status:'400',msg:key+'字段格式错误!'}));
                            return true
                            break;
                        }else{
                            // console.log(data[key]);
                        }
                    }else{
                        global.checkNullKey(data[key])
                    }
                }
            };
          if(!checkDataIsHasErrorParm(data)){
              return data;
          }

    };
     //设置跨域
    res.header ("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Headers', 'aeskey,content-type,Access-Control-Allow-Origin');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");


    //初步处理请求
    if(req.method=="OPTIONS"){
         // 发送一个预请求
        res.send(JSON.stringify({status:'200',msg:'预检请求成功!'}));/*让options请求快速返回*/
    }
    else {
        //解密参数
        /*if(req.headers.aeskey){
            if(global.decryptRSAData(req)){
                req.data = global.checkNullKey(global.decryptRSAData(req))
            }

        }*/
        next()
    };

});


module.exports = router;
