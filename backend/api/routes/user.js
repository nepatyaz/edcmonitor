const express = require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});
var base64Img = require('base64-img');
var fs = require('fs');


//dapatkan semua data user 
router.get('/getall', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    var sql = "SELECT * FROM tabeluser LIMIT 10";
    conDb.query(sql, (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//jumlah data user
router.get('/count', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    var query1 = "SELECT COUNT(id_user) as total FROM tabeluser";
    conDb.query(query1, (err, rows, fields) => {
      if (!err) {
        console.log(rows)
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }


});

//pagination data user  
router.get('/data', (req, res) => {

  var query1 = "select id_user, username, role, avatar from tabeluser LIMIT " + req.query.limit + " offset " + req.query.start;

  if (token.cekToken(req.headers['authorization'])) {
    conDb.query(query1, (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});


//searching data user base on username 
router.get('/search', (req, res) => {

  var query = "SELECT * FROM `tabeluser` WHERE username LIKE '%" + req.query.filter + "%' LIMIT " + req.query.limit + " offset " + req.query.start;
  if (token.cekToken(req.headers['authorization'])) {
    conDb.query(query, (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//searching data user base on username 
router.get('/searchcount', (req, res) => {

  var query = "SELECT count(id_user) as total FROM `tabeluser` WHERE username LIKE '%" + req.query.filter + "%'";

  if (token.cekToken(req.headers['authorization'])) {
    console.log(query);
    conDb.query(query, (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//delete user 
router.delete('/:id', (req, res) => {

  var query = "DELETE FROM `users` WHERE `id` =" + req.params.id;
    conDb.query(query, (err, rows, fields) => {
      if (!err) {
        //res.send(rows[0].affectedRows);
        if (rows.affectedRows > 0) {
          res.send(pesan.deleteSucces);
        } else {
          res.send(pesan.deleteError);
        }
        console.log(pesan.affectedRows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  

});

router.get('/profileuser/:id', (req, res) => {

  let id = req.params.id;
  let sql = "SELECT * FROM `tabeluser` where id_user = " + id;

  if (token.cekToken(req.headers['authorization'])) {
    conDb.query(sql, (err, hasil) => {
      if (!err) {
        res.send(hasil);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }
});


//login user
router.post("/login", function (req, res) {
  // console.log(req.body.username, req.body.password );
  console.log(req.headers['authorization'])
  let username = req.body.username;
  let password = req.body.password;
  let sql = "SELECT COUNT(username) as jumlah FROM `tabeluser` WHERE username = ? AND password = ? "
  console.log("Request permintaan user dengan username - password  : ", username, " - ", password);
  // console.log( enkripsi.enkrip(username));
  // console.log( enkripsi.dekrip('e529ce8d642332c6dcf527a850cd917d'));

  conDb.query(sql, [username, password], (err, hasil) => {
    if (!err) {
      if (hasil[0].jumlah > 0) {
        let querycari = "select * from tabeluser where username = ? ";
        conDb.query(querycari, [username], (err, hasil2) => {
          if (!err) {

            let user = hasil2[0].username;
            let id = hasil2[0].id_user;
            let email = hasil2[0].email;

            const token = jwt.sign({
              username: user,
              loggedIn: true,
              userid : id
            }, 'kuncirahasia', {
              expiresIn: 86400 // expire dalam 24 jam
            });
          
            console.log(token);

            let objUser = {
              userid: id,
              user: user,
              email: email,
              status: true,
              isAdmin: true,
              token: token
            };
            res.status(200).send(objUser)
          } else {
            res.status(200).send({
              message: "Login Gagal, operasi gagal dijalankan!",
              status: false
            });
            console.log("Terjadi Kesalahan : ", JSON.stringify(err));
          }
        });
      } else {
        res.status(200).send({
          status: false,
          message: "Login Gagal, User atau Password Salah!"
        })
        console.log("User atau Pass Salah !");
      }
    } else {
      res.status(200).send({
        status: false,
        message: "Login gagal, operasi gagal dijalankan!"
      })
      console.log("Query gagal, terjadi kesalahan" + err);
    }
  });

});


router.post('/uploadpic', upload.single('avatar'), function (req, res, next) {
  var fileName = req.file.filename;
  var userid = req.body.userid;

  console.log(userid);
  // var fileType = req.file.mimetype;
  var path = "uploads/" + fileName;

  if (token.cekToken(req.headers['authorization'])) {
    // let userid = token.decode(req.headers['authorization']);
    //jika token ok 
    base64Img.base64(path, function (err, data) {
      if (!err) {

        let queryupdate = "UPDATE `tabeluser` SET `avatar` = '" + data + "' WHERE `tabeluser`.`id_user` = " + userid + ";";
        conDb.query(queryupdate, (err, hasil) => {
          if (!err) {
            res.send([{
              "file": fileName,
              "base64": data
            }])
          } else {
            var pesanError = Object.assign(pesan.updatePicGagal, err);
            res.send(pesanError);
          }
        });
        //hapus file setelah proses selesai
        fs.unlink("uploads/" + fileName, function (err) {
          if (err) throw res.send({
            "message": err,
            "status": "error"
          });
          // console.log('File deleted!');
        });
      } else {
        res.send(pesan.uploadError, err)
      }
    })

  } else {
    //jika token invalid
    res.send(pesan.notAuthorized);
  }
})


module.exports = router;
