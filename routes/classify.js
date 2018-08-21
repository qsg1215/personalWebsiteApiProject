var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('../public/lib/util');


var classifySQL = require('../db/SQL/classifySQL');
var articalSQL = require('../db/SQL/articalSQL');

//新增标签
router.post('/new', function(req, res, next){
   var tagInfo = req.body;
    var sql = classifySQL.queryByName + client.escape(tagInfo.name);
    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length == 0) {
                tagInfo.ID =  uuid.v1();
                var classifyInfo = [
                    tagInfo.ID,
                    tagInfo.name,
                    tagInfo.pid,
                    new Date().getTime(),
                    new Date().getTime(),
                ]
                client.query(classifySQL.insert,classifyInfo,function (err, results) {
                    if(err){
                        throw err
                    }else{
                        res.send(JSON.stringify({status:'200',
                             data:tagInfo,
                            msg:' 添加成功!'}));
                    }
                })
            } else{
                res.send(JSON.stringify({status:'401',msg:'该分类已经存在!'}));
            }
        }
    })

});

//获取具有相同的pid 数据
router.get('/getClassify', function(req, res, next){
    var pid = req.query.pid;
    function getTree(data, pid) {
        var treelist = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == pid) {
                var newTree = {
                    ID : data[i].ID,
                    pid: data[i].pid,
                    name: data[i].name,
                    children: getTree(data, data[i].ID)
                }
                treelist.push(newTree)
            }
        }
        return treelist;
    }
    var sql = classifySQL.queryAll;

    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            var tree = getTree(results, pid);
            res.send(JSON.stringify({
                status: '200',
                data: tree,
                msg: '查询成功!'
            }))
        }
    });
});

// 编辑分类
router.put('/:id/edit', function(req, res, next){
    var calssifyID = req.params.id;
    var calssifyInfo =  req.body;
    client.query(classifySQL.update,[calssifyInfo.name, new Date().getTime(), calssifyID],  function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            var sql = classifySQL.getclassifyById + client.escape(calssifyID);
            client.query(sql, function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    res.send(JSON.stringify(
                        {
                            status:'200',
                            data: results[0],
                            msg:'编辑成功!'}
                    ));
                }

            })
        }
    })

});

// 删除分类
router.delete('/:id/delete', function(req, res, next){
    var clasifyID = req.params.id
    var sql = classifySQL.getclassifyById + client.escape(clasifyID);
    client.query(sql, function (error, results, fields) {
        if (error) {
            throw error;
        } else {
            if (results.length === 0) {
                res.send(JSON.stringify({status:'401',
                    msg:'没有相关分类的信息, 删除失败!,'}));
            }else {
                var pidSQL = classifySQL.getclassifyByPid + client.escape(clasifyID);
                client.query(pidSQL,  function (error, searchResult, fields) {
                    if (error) {
                        res.send(JSON.stringify({status:'401',
                            msg:'删除失败!'}));
                        throw error;
                    }else{
                        if (!searchResult.length) {

                            var getArticalClassifyID = articalSQL.getArticalClassfiById + client.escape(clasifyID);
                            client.query(getArticalClassifyID,  function (error, articalResult, fields) {
                                if (error) {
                                    res.send(JSON.stringify({status:'401',
                                        msg:'删除失败!'}));
                                    throw error;
                                }else{
                                   if (articalResult.length) {
                                       res.send(JSON.stringify({status:'401',
                                           msg:'当前有分类正在被使用!'}));
                                   } else {
                                       client.query(classifySQL.deleteClassifyById,[clasifyID],  function (error, searchResult, fields) {
                                           if (error) {
                                               console.log('删除失败')
                                               res.send(JSON.stringify({status:'401',
                                                   msg:'删除失败!,'}));
                                               throw error;
                                           }else{
                                               res.send(JSON.stringify({status:'200',
                                                   msg:'删除成功!,'}));
                                           }
                                       })
                                   }

                                }
                            })
                        }else {
                            res.send(JSON.stringify({status:'200',
                                msg:'当前分类下面还有子集元素!'}));
                        }

                    }
                })
            }

        }
    })
});



module.exports = router;