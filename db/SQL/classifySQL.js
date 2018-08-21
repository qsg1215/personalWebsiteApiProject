/**
 * Created by php on 2018/1/8.
 */
var classifySQL = {
    insert:'INSERT INTO classify (ID, name, pid, addAt, editAt) VALUES (?, ?, ?, ?, ?)',
    queryAll:'SELECT * FROM classify',
    getclassifyById:'SELECT * FROM classify WHERE ID = ',
    getclassifyByPid:'SELECT * FROM classify WHERE pid = ',
    update: 'UPDATE classify SET name = ?, editAt = ? WHERE ID = ?',
    deleteClassifyById: 'DELETE FROM classify WHERE ID = ?',
    queryByName:'SELECT * FROM classify WHERE name =',
};
module.exports = classifySQL;
