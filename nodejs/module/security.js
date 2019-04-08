const jwt = require('jsonwebtoken');

exports.cekToken = function(data) {
    var isToken = data ? true : false;
    if(isToken){
        let token = data.substr(7);
        // console.log(token);
        try {
            jwt.verify(token, 'kuncirahasia');
            return true;
        } catch (err) {
           return false;
        }
    }else{
        return false;
    }
  }

exports.decode = function(data) {
    let token = data.substr(7);
    var decoded = jwt.verify(token, 'kuncirahasia');
    // log.log1(decoded.username) // bar
    return decoded.userid;
  }
