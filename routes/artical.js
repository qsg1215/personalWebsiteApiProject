var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../public/lib/util');




var articalSQL = require('../db/SQL/articalSQL');
var classifySQL = require('../db/SQL/classifySQL');
var commentSQL = require('../db/SQL/commentSQL');

//添加文章
router.post('/new', function(req, res){
    var articalInfo = req.body;
    var sql = articalSQL.queryByTitle + client.escape(articalInfo.title);
    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length == 0) {
                articalInfo.ID =  uuid.v1()
                var itemInfo = [
                    articalInfo.ID,
                    articalInfo.title,
                    articalInfo.classifyID,
                    articalInfo.keyWords,
                    articalInfo.abstract,
                    articalInfo.content,
                    new Date().getTime(),
                    new Date().getTime(),
                    0
                ];
                client.query(articalSQL.insert, itemInfo, function (err, results) {
                    if(err){
                        throw err;
                    }else{
                        res.send(JSON.stringify({
                                status:'200',
                                data:articalInfo,
                               msg:' 发布成功!'
                            }));
                    }
                })
            } else{
                res.send(JSON.stringify({status:'401',msg:'该文章标题已经存在!'}));
            }
        }
    })
});
//查询文章列表
router.get('/getArtical', function(req, res, next){
    console.log(req, 'hahahhaha')
    var sql = articalSQL.queryAll;
    if ( req.query && req.query.start  &&  req.query.limit){
        //不分页的情况
        client.query(sql, function (error, results, fields) {
            if (error) {
                throw error;
            } else {

                // 查找评论条数
                client.query(commentSQL.queryAllComment,function(error, comments, fields) {
                  var articalList =   [].concat(results).splice(req.query.start, req.query.limit);
                    articalList =  articalList.map(item => {
                        item.commentCount = comments.filter(commentItem => {
                            return commentItem.articalID === item.ID && commentItem.replyID == 0
                        }).length;
                        return item;
                    })
                    res.send(
                        {
                            status:'200',
                            data:{
                                datalist: articalList,
                                totalCount:results.length,
                            },
                            msg:'查询成功'
                        }
                    );
                })

            }
        });
    }else{
        //不分页的情况
    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            // 查找评论条数
            client.query(commentSQL.queryAllComment,function(error, comments, fields) {
                results =  results.map(item => {
                    item.commentCount = comments.filter(commentItem => {
                        return commentItem.articalID === item.ID && commentItem.replyID == 0
                    }).length;
                    return item;
                })
                res.send(
                    {
                        status:'200',
                        data:results,
                        msg:'查询成功'
                    }
                );
            })

        }
    });
    }
});

//查询文章详情
router.get('/getArtical/:id', function(req, res, next){
    var articalID = req.params.id
    var sql = articalSQL.getArticalById + client.escape(articalID);


    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {

            // 查找到对应的数据
            var readCount = Number(results[0].readCount);
            var resData = results[0]
            var updateReadCountParams = [readCount+1 , articalID]
            client.query(articalSQL.updateReadCount,updateReadCountParams, function (error, results, fields) {
                if (error){
                    throw error;
                }else{
                    var sql = classifySQL.getclassifyById + client.escape(resData.classifyID);
                    client.query(sql, function (error, classifyResults, fields) {
                        if (error) {
                            throw error;
                        } else {
                            resData.classify = classifyResults[0];
                            delete resData.classifyID
                            res.send(JSON.stringify({
                                status:'200',
                                data:resData,
                                msg:'查询成功!'}));
                        }
                    })


                }
            })

        }
    })

});

//编辑文章
router.put('/:id/edit', function(req, res, next){
    var aticalInfo =  req.body;
    var articalID = req.params.id
    var  params = [
        aticalInfo.title,
        aticalInfo.classifyID,
        JSON.stringify(aticalInfo.keyWords),
        aticalInfo.abstract,
        aticalInfo.content,
        (new Date()).getTime(),
        articalID
    ];
    client.query(articalSQL.update,params, function (error, results, fields) {
        if (error){
            throw error;
        }else{
            var sql = articalSQL.getArticalById + client.escape(articalID);
            client.query(sql, function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    var resData = results;
                    res.send(JSON.stringify({
                        status:'200',
                        data:resData,
                        msg:'编辑成功'}));
                }
            })

        }
    })
});

//删除文章
router.delete('/:id/delete', function(req, res, next){
    var articalID = req.params.id
    var sql = articalSQL.getArticalById + client.escape(articalID);
    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length === 0) {
                res.send(JSON.stringify({status:'401',
                    msg:'没有文章相关的信息, 删除失败!,'}));
            }else {
                client.query(articalSQL.deleteArticalById,[articalID],  function (error, results, fields) {
                    if (error) {
                        res.send(JSON.stringify({status:'401',
                            msg:'删除失败!,'}));
                        throw error;
                    }else{
                        res.send(JSON.stringify({status:'200',
                            msg:'删除成功!'}));
                    }
                })
            }

        }
    })
});


module.exports = router;