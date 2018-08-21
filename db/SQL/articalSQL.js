/**
 * Created by php on 2018/1/8.
 */
var articalSQL = {
    insert:'INSERT INTO artical (ID, title,classifyID,keyWords, abstract,content, addAt,editAt,readCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    queryAll: `select 
    artical.ID,
    artical.title,
    artical.keyWords,
    artical.abstract,
    artical.addAt,
    artical.editAt,
    artical.readCount,
    classify.name as classifyName 
    from 
    artical inner join classify 
    on artical.classifyID = classify.ID 
    ORDER BY addAt DESC`,
    getArticalById:'SELECT * FROM artical WHERE ID =',
    queryByTitle:'SELECT * FROM artical WHERE title =',
    getArticalClassfiById:'SELECT * FROM artical WHERE classifyID =',
    update: `UPDATE artical SET  title = ?,classifyID = ?,keyWords = ?,abstract = ?,content = ?,editAt = ? WHERE ID = ? `,
    updateReadCount: `UPDATE artical SET  readCount = ? WHERE ID = ? `,
    deleteArticalById: 'DELETE FROM artical WHERE ID = ?'
};
module.exports = articalSQL;
