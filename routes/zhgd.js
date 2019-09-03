var express = require('express');
var router = express.Router();
var zhgdSQL = require('../db/SQL/zhgdSQL');
var moment = require('moment')

//获取备案列表
router.get('/getFilling', function (req, res, next) {
    //start limit 必传;  模糊查询 编号 准备查询状态
    let sql = `
    select zhgd_filling.* ,zhgd_devices.deviceCode, zhgd_devices.type,zhgd_corporation.name,zhgd_corporation.tel,zhgd_corporation.resPerson from zhgd_filling 
    left join zhgd_devices
    on zhgd_filling.devicesId=zhgd_devices.devicesId
  
    left join zhgd_corporation_apply
    on zhgd_devices.corporationId=zhgd_corporation_apply.corporationId
    left join zhgd_corporation
    on zhgd_corporation_apply.corporationId=zhgd_corporation.corporationId

    where zhgd_filling.type = ? and zhgd_filling.status = ? and zhgd_corporation_apply.status = 'PASS'
    ${req.query.keyWords ? ' and  zhgd_filling.num LIKE ?' : ''}
    order  by zhgd_filling.createTime desc
    `
    if (req.query && req.query.start && req.query.limit) {
        client.query(sql, [req.query.type, req.query.status, `%${req.query.keyWords}%`,], function (error, results, fields) {
            var fillingList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: fillingList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }
});


//获取已备案列表
router.get('/getFillingList', function (req, res, next) {
    //start limit 必传;  模糊查询 编号 准备查询状态
    let sql = `
    select zhgd_filling.* ,zhgd_devices.deviceCode,zhgd_corporation.name,zhgd_corporation.tel,zhgd_corporation.resPerson from zhgd_filling 
    left join zhgd_devices
    on zhgd_filling.devicesId=zhgd_devices.devicesId

    left join zhgd_corporation_apply
    on zhgd_devices.corporationId=zhgd_corporation_apply.corporationId
    left join zhgd_corporation
    on zhgd_corporation_apply.corporationId=zhgd_corporation.corporationId

   

    where zhgd_filling.type = ? and zhgd_filling.status = 'PASS' and zhgd_corporation_apply.status = 'PASS'
    and zhgd_filling.isDelete = '0'
    ${req.query.keyWords ? ' and  zhgd_filling.num LIKE ?' : ''}
    ${req.query.isCallBack ? ' and  zhgd_filling.isCallBack = ?' : ''}
    order  by zhgd_filling.createTime desc
    `

    //公司是有资质才能备案
    if (req.query && req.query.start && req.query.limit) {
        client.query(sql, [req.query.type, `%${req.query.keyWords}%`, req.query.isCallBack], function (error, results, fields) {
            var fillingList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: fillingList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }
});

//注销备案
router.get('/logoutFiling', function (req, res, next) {
    let sql = `
    update zhgd_filling set isDelete = '1' WHERE id = ?
    `
    if (req.query) {
        client.query(sql, [Number(req.query.id)], function (error, results, fields) {
            console.log(error, results, fields)
            if (!error) {

                res.send(
                    {
                        status: '200',
                        msg: '注销成功!'
                    }
                );
            }
        })
    }
});

//收回或者重启备案
router.get('/callBackFiling', function (req, res, next) {
    let sql = `
    update zhgd_filling set isCallBack = ? WHERE id = ?
    `
    if (req.query) {
        client.query(sql, [req.query.isCallBack, Number(req.query.id)], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '操作成功!'
                    }
                );
            }
        })
    }
});

//审核备案
router.post('/checkFiling', function (req, res, next) {
    let sql = `
    update zhgd_filling set status = ?, comment= ?  where id = ? 
    `
    console.log(req.body.status)
    if (req.body) {
        client.query(sql, [req.body.status, req.body.comment, req.body.id,], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '审核成功!'
                    }
                );
            }
        })
    }
});

//使用登记
router.get('/register', function (req, res, next) {
    //start limit 必传;  模糊查询 编号 准备查询状态
    let sql = `
     select zhgd_register.* ,zhgd_devices.deviceCode,zhgd_devices.type,zhgd_corporation.name,zhgd_corporation.tel,zhgd_corporation.resPerson from zhgd_register 
     left join zhgd_devices
     on zhgd_register.devicesId=zhgd_devices.devicesId
     left join zhgd_corporation_apply
     on zhgd_register.useCompanyId=zhgd_corporation_apply.corporationId
     left join zhgd_corporation
     on zhgd_corporation_apply.corporationId=zhgd_corporation.corporationId
     
 
     where  zhgd_register.status = ? 
     and zhgd_corporation_apply.status = 'PASS'

     ${req.query.keyWords ? ' and  zhgd_register.num LIKE ?' : ''}
     order  by zhgd_register.createTime desc
     `
    //公司是有资质才能备案
    if (req.query && req.query.start && req.query.limit) {
        client.query(sql, [req.query.status, `%${req.query.keyWords}%`], function (error, results, fields) {
            var fillingList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: fillingList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }
});

//审核使用登记
router.post('/checkRegister', function (req, res, next) {
    let sql = `
    update zhgd_register set status = ?, comment= ?  where id = ? 
    `

    if (req.body) {
        client.query(sql, [req.body.status, req.body.comment, Number(req.body.id)], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '审核成功!'
                    }
                );
            }
        })
    }
});

//资质管理
router.get('/company', function (req, res, next) {
    let sql = `
    select zhgd_corporation_apply.id , 
    zhgd_corporation_apply.createTime,
    zhgd_corporation_apply.status,
    zhgd_corporation_apply.comment,
    zhgd_corporation_apply.publishTime,

    zhgd_corporation.name,
    zhgd_corporation.resPerson,
    zhgd_corporation.tel,
    zhgd_corporation.companyType,
    zhgd_corporation.IDCard



    from zhgd_corporation_apply 
    left join zhgd_corporation
    on zhgd_corporation_apply.corporationId=zhgd_corporation.corporationId

    where  zhgd_corporation_apply.status = ?
    and  zhgd_corporation.companyType = ?
    ${req.query.keyWords ? ' and  zhgd_corporation.name LIKE ?' : ''}
    order  by zhgd_corporation_apply.createTime desc
    `
    //公司是有资质才能备案
    if (req.query && req.query.start && req.query.limit) {
        client.query(sql, [req.query.status, req.query.companyType, `%${req.query.keyWords}%`], function (error, results, fields) {
            var fillingList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: fillingList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }
});

//审核公司资质
router.post('/checkCompany', function (req, res, next) {
    let sql = `
    update zhgd_corporation_apply set comment = ?,status = ?
    where  id = ?
    `
    if (req.body) {
        client.query(sql, [req.body.comment, req.body.status, Number(req.body.id)], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '审核成功!'
                    }
                );
            }
        })
    }
});

//查询信息列表
router.get('/info', function (req, res, next) {
    let sql = `
    select *  from zhgd_infoRelease 
    where  isPublish = ? 
    and  isDelete = '0' 
    ${req.query.keyWords ? 'and num LIKE ?' : ''}
    order  by publishTime desc
    `
    console.log(req.query)
    //公司是有资质才能备案
    if (req.query && req.query.start && req.query.limit) {
        client.query(sql, [req.query.isPublish, `%${req.query.keyWords}%`], function (error, results, fields) {
            var fillingList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: fillingList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }

});

//删除信息
router.delete('/deleteInfo', function (req, res, next) {
    let sql = `update zhgd_infoRelease set isDelete = 1  where  id = ?  `
    if (req.body) {
        client.query(sql, [req.body.id], function (error, results, fields) {
            res.send(
                {
                    status: '200',
                    msg: '删除成功!'
                }
            );
        })
    }

});

//发布信息
router.put('/publishInfo', function (req, res, next) {
    let sql = `update zhgd_infoRelease set isPublish = 1 ,publishPerson = ? , publishTime = ? where  id = ?  `
    if (req.body) {
        client.query(sql, [req.body.publishPerson, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.id], function (error, results, fields) {
            res.send(
                {
                    status: '200',
                    msg: '发布成功!'
                }
            );
        })
    }

});

//新增消息
router.post('/newInfo', function (req, res, next) {
    let sql = `
    insert into zhgd_infoRelease (
        num, 
        createTime,
        lastEditTime,
        publishTime,
        content ,
        peojectID,
        isPublish,
        isDelete
        ) values (
        ?,?,?,?,
        ?,?,?,?
        )
    `
    client.query('select max(id) as maxID from zhgd_infoRelease', [], function (error, results, fields) {
        if (req.body) {
            client.query(sql, [
                'info' + results[0].maxID,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                moment().format('YYYY-MM-DD HH:mm:ss'),
                moment().format('YYYY-MM-DD HH:mm:ss'),
                req.body.content,
                req.body.projects,
                '0',
                '0',
            ], function (error, results, fields) {
                console.log(error, fields)
                if (!error) {
                    res.send(
                        {
                            status: '200',
                            msg: '新建成功!'
                        }
                    );
                }
            })
        }
    })

});

//编辑消息
router.put('/editInfo', function (req, res, next) {
    let sql = `
    update  zhgd_infoRelease 
        set lastEditTime = ?, 
        content =  ?,
        peojectID = ?
        where id = ?
    `
    if (req.body) {
        client.query(sql, [
            moment().format('YYYY-MM-DD HH:mm:ss'),
            req.body.content,
            req.body.peojectID,
            req.body.id
        ], function (error, results, fields) {
            console.log(error, fields)
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '编辑成功!'
                    }
                );
            }
        })
    }

});

// //发布消息
// router.put('/publishInfo', function (req, res, next) {
//     let sql = `
//     update  zhgd_infoRelease 
//         set isPublish = '1',
//         publishTime = ?,
//         publishPerson = ?
//         where id = ?
//     `
//     console.log(req.body)
//     if (req.body) {

//         client.query(sql, [
//             moment().format('YYYY-MM-DD HH:mm:ss'),
//             req.body.publishPerson,
//             req.body.id
//         ], function (error, results, fields) {
//             if (!error) {
//                 res.send(
//                     {
//                         status: '200',
//                         msg: '发布成功!'
//                     }
//                 );
//             }
//         })
//     }

// });



//查询企业
router.get('/companyMag', function (req, res, next) {
    let sql = `
    select * from zhgd_corporation 
    where companyType = ?
    ${req.query.keyWords ? 'and name LIKE ?' : ''}
    and isDelete = '0'
    `
    if (req.body && req.query.start && req.query.limit) {
        client.query(sql, [req.query.companyType, `%${req.query.keyWords}%`], function (error, results, fields) {
            var dataList = [].concat(results).splice(req.query.start, req.query.limit);
            res.send(
                {
                    status: '200',
                    data: {
                        datalist: dataList,
                        totalCount: results.length,
                    },
                    msg: '查询成功'
                }
            );
        })
    }

});


//新增企业
router.post('/newCompany', function (req, res, next) {
    let sql = `
    insert into zhgd_corporation (
        corporationId,
        name, 
        resPerson,
        tel,
        accountCode,
        nickName ,
        address,
        createTime,
        IDCard,
        companyType,
        account,
        password,
        updateTime,
        isDelete,
        accountTime,
        accountStatus
        ) values (
        ?,?,?,?,?,
        ?,?,?,?,?,
        ?,?,?,?,?,
        ?
        )
    `
    client.query('select max(corporationId) as maxID from zhgd_corporation', [], function (error, results, fields) {
        if (req.body) {
            client.query(sql, [
                results[0].maxID + 1,
                req.body.name,
                req.body.resPerson,
                req.body.tel,
                '00' + (results[0].maxID + 1),
                req.body.nickName,
                req.body.address,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                req.body.IDCard,
                req.body.companyType,
                null,
                null,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                0,
                null,
                null
            ], function (error, results, fields) {
                console.log(error, fields)
                if (!error) {
                    res.send(
                        {
                            status: '200',
                            msg: '新建成功!'
                        }
                    );
                }
            })
        }
    })
});


//编辑企业
router.put('/editCompany', function (req, res, next) {
    let sql = `
    update  zhgd_corporation 
        set name = ?, 
        resPerson =  ?,
        tel = ?,
        nickName = ? ,
        address = ?,
        IDCard = ?,
        updateTime = ?
        where id = ?
    `
    if (req.body) {
        client.query(sql, [
            req.body.name,
            req.body.resPerson,
            req.body.tel,
            req.body.nickName,
            req.body.address,
            req.body.IDCard,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            req.body.id,
        ], function (error, results, fields) {
            console.log(error, fields)
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '编辑成功!'
                    }
                );
            }
        })
    }

});

//删除企业
router.delete('/deleteCompany', function (req, res, next) {
    let sql = `
    update  zhgd_corporation 
        set isDelete = '1' 
        where id = ?
    `
    if (req.body) {
        client.query(sql, [
            req.body.id,
        ], function (error, results, fields) {
            console.log(error, fields)
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '删除成功!'
                    }
                );
            }
        })
    }

});

//发放账号(账户还没有随机)
router.post('/account', function (req, res, next) {
    let sql = `
    update  zhgd_corporation 
        set account = ?,
         password = ?,
         accountTime = ?,
         accountGivePerson = ?
        where id = ?
    `
    if (req.body) {
        client.query('select * from zhgd_corporation where id = ? ', [
            req.body.id,
        ], function (error, results, fields) {
            if (!error) {
                if (results[0].account) {
                    res.send(
                        {
                            status: '400',
                            msg: '该企业已经分配了账号!'
                        }
                    );
                } else {
                    client.query(sql, [
                        'chen',
                        '1215',
                        moment().format('YYYY-MM-DD HH:mm:ss'),
                        req.body.accountGivePerson,
                        req.body.id
                    ], function (error, results, fields) {
                        res.send(
                            {
                                status: '200',
                                data: {
                                    account: 'chen',
                                    password: '1215'
                                },
                                msg: '账号分配成功!'
                            }
                        );

                    })
                }

            }
        })
    }

});

//冻结或者解冻账号
router.put('/forizeAccount', function (req, res, next) {
    let sql = `
    update  zhgd_corporation 
        set accountStatus = ?
        where id = ?
    `
    if (req.body) {
        client.query(sql, [
            req.body.accountStatus,
            req.body.id
        ], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        msg: '操作成功!'
                    }
                );

            }
        })
    }

});

//获取地区下面的项目
router.get('/getprojectsByArea', function (req, res, next) {
    let sql = `
      select * from zhgd_area 
    `
    if (req.body) {
        client.query(sql, [], function (error, results, fields) {
            if (!error) {
                Promise.all(
                    results.map(item => {
                        return new Promise(function (resolve, reject) {
                            //  var item = JSON.parse(JSON.stringify(item))
                            if (Object.values(item)[4]) {
                                let searchSql = `select proejctId, proejctName from zhgd_project where id in (${Object.values(item)[4]})`;
                                client.query(searchSql, [], function (error, res, fields) {
                                    if (!error) {
                                        item.projects = res;
                                        resolve(item)

                                    } {
                                        reject(error)
                                    }
                                })
                            } else {
                                item.projects = [];
                                resolve(item);
                            }
                        });

                    })

                ).then(function (values) {
                    res.send(
                        {
                            status: '200',
                            data: {
                                dataList: values
                            },
                            msg: '操作成功!'
                        }
                    );
                });



            }
        })
    }

});

//获取地区
router.get('/getAreas', function (req, res, next) {
    let sql = `
      select id,  areaId,name , projectids   from zhgd_area 
    `
    if (req.body) {
        client.query(sql, [], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        data: {
                            dataList: results
                        },
                        msg: '操作成功!'
                    }
                );


            }
        })
    }

});

//获取地区下面的项目
router.post('/getProjects', function (req, res, next) {
    let ids = req.body.ids
    let sql = `
      select * from zhgd_project ${ids && `where id in (${ids} )`}
`
    if (req.body) {
        client.query(sql, [], function (error, results, fields) {
            if (!error) {
                res.send(
                    {
                        status: '200',
                        data: {
                            dataList: results
                        },
                        msg: '操作成功!'
                    }
                );


            }
        })
    }

});

// //查询项目下面的设备
router.get('/getDevicesByProejct', function (req, res, next) {
    let projectId = req.query.projectId
    let sql = ` select * from zhgd_project where id = ?`
    if (req.body) {
        client.query(sql, [projectId], function (error, results, fields) {
            if (!error) {
                console.log(results[0].joinDeviceIds)
                client.query(`select * from zhgd_devices where id in  (${results[0].joinDeviceIds})`, [projectId], function (error, devices, fields) {
                    if (!error) {
                        results[0].devices = devices
                        res.send(
                            {
                                status: '200',
                                data: results[0],
                                msg: '操作成功!'
                            }
                        );


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
    }

})

// //查询项目下面的设备
router.get('/warn', function (req, res, next) {
    let projectId = req.query.projectId
    client.query('select * from zhgd_warn where projectId = ?', [projectId], function (error, results, fields) {
        res.send(
            {
                status: '200',
                data: {
                    dataList: results
                },
                msg: '操作成功!'
            }
        );

    })

})













module.exports = router;