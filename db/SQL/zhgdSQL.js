/**
 * Created by php on 2018/1/8.
 */
var zhgdSQL = {
    insert: `INSERT INTO 
    zhgd_filling (
     ID,
     nickName,
     email,
     personalWebsite,
     replyID,
     articalID,
     addAt,
     editAt,
     status,
     content
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    queryFilling: 'select * from zhgd_filling ORDER  BY createTime ASC',
    queryFillingByCondition: 'select * from zhgd_filling  WHERE PUPLAR = ? and status = ? and WHERE num LIKE ?',
    updateCommentStatus: 'UPDATE zhgd_filling SET status = ?, editAt = ? WHERE ID = ?',
    queryCommentByarticalID: 'select * from zhgd_filling WHERE articalID = ? ORDER  BY addAt ASC'
};
module.exports = zhgdSQL;
