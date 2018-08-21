/**
 * Created by php on 2018/1/21.
 */
var CryptoJS = require('crypto-js');
var util = module.exports = {};

util.decryption =  function (encrypted,key,iv){
    var decrypted =CryptoJS.AES.decrypt(encrypted.toString(),key,
        {
            iv:iv,
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

util.encryption =  function (data,key,iv){
    var encrypted  = CryptoJS.AES.encrypt(data,key,
        {
            iv:iv,
            mode:CryptoJS.mode.ECB,
            padding:CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
};