var crypto = require('crypto');

// exports.enkrip = function (data) {

//     var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
//     var mystr = mykey.update('abc', 'utf8', 'hex')
//     mystr += mykey.update.final('hex');
    
//     return mystr;
// }


exports.enkrip = function(data) {
    var cipher = crypto.createCipher('aes-128-ecb', 'kuncirahasia');
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  }
  

exports.dekrip = function (data) {
    var cipher = crypto.createDecipher('aes-128-ecb', 'kuncirahasia');
    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
}
