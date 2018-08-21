/**
 * Created by php on 2018/1/8.
 */
var userSQL = {
    insert:'INSERT INTO user (userName, password) VALUES (?, ?)',
    queryAll:'SELECT * FROM user',
    getUserById:'SELECT * FROM user WHERE userId = ?',
    update: 'UPDATE user SET userName = ?,password = ? WHERE userId = ?',
    deleteUserById: 'DELETE FROM user WHERE userId = ?',
    queryByUserName:'SELECT * FROM user WHERE userName = ',
};
module.exports = userSQL;
