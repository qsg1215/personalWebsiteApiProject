var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../public/lib/util');




var commentSQL = require('../db/SQL/commentSQL');

//添加文章评论
router.post('/new', function(req, res){
    var commentInfo = req.body;
    commentInfo.ID =  uuid.v1();
        client.query(commentSQL.insert,
            [   commentInfo.ID,
                commentInfo.nickName,
                commentInfo.email,
                commentInfo.personalWebsite,
                commentInfo.replyID,
                commentInfo.articalID,
                new Date().getTime(),
                new Date().getTime(),
                0,
                commentInfo.content,
            ],function (err, results) {
            if(err){
                throw err
            }else{
                res.send(JSON.stringify({status:'200',
                    data:commentInfo,
                    msg:'评价成功!'}));
            }
        })

});

// 审核或者禁用评论
router.put('/:id/edit', function(req, res, next){
    var commentInfo =  req.body;
    var commentID = req.params.id
    console.log(commentID, commentInfo, '收到的参数')
    client.query(commentSQL.updateCommentStatus,
        [   commentInfo.status,
            new Date().getTime(),
            commentID
        ],function (err, results) {
            if(err){
                res.send(JSON.stringify({
                    status:'200',
                    msg: '审核失败!'
                }));
                throw err
            }else{
                client.query(commentSQL.queryCommentByID,commentID, function (error, results, fields) {
                    if(err){
                        res.send(JSON.stringify({
                            status:'200',
                            msg: '审核失败!'
                        }));
                        throw err
                    } else {
                        res.send(JSON.stringify({
                            status:'200',
                            data:results[0],
                            msg:Number(commentInfo.status) ? '审核成功!': '禁用成功!'
                        }));
                    }

                })

            }
        })
});


//查询文章下的评论列表(支持分页,前端用户)
router.get('/getComment/web', function(req, res, next){
    function getTree(data, replyID) {
        var treelist = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].replyID == replyID) {
                var newTree = {
                    ID : data[i].ID,
                    nickName : data[i].nickName,
                    addAt : data[i].addAt,
                    personalWebsite : data[i].personalWebsite,
                    replyID: data[i].replyID,
                    content: data[i].status ? data[i].content: '你的评论正在审核',
                    status: data[i].status,
                    children: getTree(data, data[i].ID)
                }
                treelist.push(newTree)
            }
        }
        return treelist;
    }
    if ( req.query && req.query.start  &&  req.query.limit){
        //分页的情况
        client.query( commentSQL.queryCommentByarticalID,[req.query.articalID], function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                res.send(JSON.stringify({
                    status:'200',
                    data: {
                            dataList: getTree(results, 0).splice(req.query.start, req.query.limit),
                            totalResult:  getTree(results, 0).length
                        },
                    msg:'查询成功!'}));
            }
        });
    }else{
    //不分页的情况
    client.query( commentSQL.queryCommentByarticalID,[req.query.articalID], function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            res.send(JSON.stringify({
                status:'200',
                data:getTree(results, 0),
                msg:'查询成功!'}));
        }
    });
    }
});

//查询文章下的评论列表(支持分页,后端审核评价用)
router.get('/getComment/root', function(req, res, next){
    if ( req.query && req.query.start  &&  req.query.limit){
        //分页的情况
        client.query( commentSQL.queryAllComment, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                res.send(JSON.stringify({
                    status:'200',
                    data:{
                        dataList: [].concat(results).splice(req.query.start, req.query.limit),
                        totalResult: results.length
                    },
                    msg:'查询成功!'}));
            }
        });
    }else{
        //不分页的情况
        client.query( commentSQL.queryAllComment, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                res.send(JSON.stringify({
                    status:'200',
                    data:results,
                    msg:'查询成功!'}));
            }
        });
    }
});


module.exports = router;