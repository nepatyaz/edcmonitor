const express = require('express');
const router = express.Router();

//request data user dari frontend
router.post("/", function (req, res) {
    console.log(req.body.username + req.body.password)
    //jika inputan username tidak kosong
    var username= req.body.username;
    var password = req.body.password;
    console.log(username)
    if (req.body.username) {
        conDb.query('SELECT * FROM tabeluser WHERE username = ?',[username], function (error, results, fields) {
            if (error) {
              // console.log("error ocurred",error);
              res.json({
                "code":400,
                "failed":"error ocurred"
              })
            }else{
              // console.log('The solution is: ', results);
              if(results.length > 0){
                if(results[0].password == password){
                  res.json({
                    "code":200,
                    "status" : "OK",
                    "message":"login sucessfull"
                      });
                }
                else{
                  res.json({
                    "code":204,
                    "status" : "BAD",
                    "message":"username and password does not match !"
                      });
                }
              }
              else{
                res.json({
                  "code":204,
                  "status" : "BAD",
                  "message":"username does not exits"
                    });
              }
            }
        });
    }
});

module.exports = router;