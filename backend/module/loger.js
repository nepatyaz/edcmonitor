const jwt = require('jsonwebtoken');

exports.log1 = function(value1) {
    console.log(value1);
}
exports.log2 = function(value1, value2) {
    console.log(value1, value2);
}
exports.log3 = function(value1, value2, value3) {
    console.log(value1, value2, value3);
}