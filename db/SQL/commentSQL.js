/**
 * Created by php on 2018/1/8.
 */
var commentSQL = {
    insert: `INSERT INTO 
    comment (
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
    queryAllComment:'select * from comment ORDER  BY editAt ASC',
    queryCommentByID:'select * from comment  WHERE ID = ?',
    updateCommentStatus: 'UPDATE comment SET status = ?, editAt = ? WHERE ID = ?',
    queryCommentByarticalID:'select * from comment WHERE articalID = ? ORDER  BY addAt ASC'
};
module.exports = commentSQL;
