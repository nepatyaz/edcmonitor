const express = require('express');
const router = express.Router();

// var multer = require('multer');
// var upload = multer({
//   dest: 'uploads/'
// });
// var base64Img = require('base64-img');
// var fs = require('fs');

//dapatkan semua data user 
router.get('/', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    conDb.query("SELECT id, avatar, address1, address2, address3, branch, email, enabled, name, username FROM users LIMIT 10", (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    // console.log("token not accepted");
    res.status(400);
    res.send(pesan.notAuthorized);
  }

});

//jumlah data user
router.get('/count', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    var query = "SELECT COUNT(id) as total FROM users";
    console.log(query);
    conDb.query(query, (err, rows) => {
      if (!err) {
        // console.log(rows)
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.status(400);
    res.send(pesan.notAuthorized);
  }
});


//pagination data user  
router.get('/data', (req, res) => {

  var query = "SELECT id, avatar, address1, address2, address3, branch, email, enabled, name, username from users LIMIT " + req.query.limit + " offset " + req.query.start;
  console.log(query);
  if (token.cekToken(req.headers['authorization'])) {
    conDb.query(query, (err, rows) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.send(pesanError);
      }
    });
  } else {
    res.status(400);
    res.send(pesan.notAuthorized);
  }

});

//searching data user base on username 
router.get('/search', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    var query = "SELECT id, avatar, address1, address2, address3, branch, email, enabled, name, username FROM users WHERE username LIKE '%" + req.query.filter + "%' LIMIT " + req.query.limit + " offset " + req.query.start;
    console.log(query);
    conDb.query(query, (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        console.log(pesanError);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//searching data user base on username 
router.get('/searchcount', (req, res) => {


  if (token.cekToken(req.headers['authorization'])) {
    var query = "SELECT count(id) as total FROM `users` WHERE username LIKE '%" + req.query.filter + "%'";
    console.log(query);
    conDb.query(query, (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        console.log(pesanError);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});



router.get('/roles/:id', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    conDb.query("SELECT roles FROM users_roles WHERE users_id = ?", req.params.id, (err, result) => {
      if (!err) {
        var itemRoles = [];
        result.forEach(element => {
          itemRoles.push(element.roles);
        });
        res.send(itemRoles);
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.status(400);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//cek registered username
router.post('/usernamecek', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    conDb.query("SELECT count(username) as total FROM users where username = ?", req.body.username, (err, result) => {
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

//update user data
router.put('/', (req, res) => {
  if (token.cekToken(req.headers['authorization'])) {
    var query1 = "DELETE FROM `edcmondb`.`users_roles` WHERE `users_id` = " + req.body.id;
    console.log(query1);
    conDb.query(query1, (err, result) => {
      if (err) {
        res.statusMessage = "Gagal Update Users Roles";
        res.status(400);
      }
    });

    var query2 = "UPDATE users SET address1 = '" + req.body.address1 + "', address2 = '" + req.body.address2 + "', address3 = '" + req.body.address3 + "', email = '" + req.body.email + "', enabled = '" + req.body.enabled.data + "',  password = '" + req.body.password + "', avatar = '" + req.body.avatar + "' WHERE `users`.`id` = " + req.body.id;
    console.log(query2);
    conDb.query(query2, (err, result) => {
      if (err) {
        res.statusMessage = "Gagal Update Users Data";
        res.status(400);
      }
    });

    req.body.roles.forEach(element => {
      var query3 = "INSERT INTO `edcmondb`.`users_roles` (`users_id`, `roles`) VALUES ('" + req.body.id + "', '" + element + "');";
      console.log(query3);
      conDb.query(query3, (err, result) => {
        if (err) {
          res.statusMessage = "Gagal Update Users Roles";
          res.status(400);
        }
      });
    });

    res.send({ "message": "Update Done" });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//delete user 
router.delete('/delete/:id', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {
    var query1 = "DELETE FROM users_roles WHERE users_id = " + req.params.id;
    var query2 = "DELETE FROM users WHERE id = " + req.params.id;

    console.log(query1);
    console.log(query2);
    conDb.query(query1, (err, result) => {
      if (!err) {
        conDb.query(query2, (err, result2) => {
          if (!err) {
            res.send(pesan.deleteSucces)
          } else {
            res.status(400).send(pesan.deleteError);
          }
        });
      } else {
        var pesanError = Object.assign(pesan.deleteError, err);
        res.status(400).send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});

//register user 
router.post('/register', (req, res) => {

  if (token.cekToken(req.headers['authorization'])) {

    username = req.body.username;
    email = req.body.email;
    password = req.body.password;
    branch = req.body.branch;
    enabled = req.body.enabled;
    lastPasswordResetDate = req.body.lastPasswordResetDate;
    avatar = req.body.avatar;
    address1 = req.body.address1;
    address2 = req.body.address2;
    address3 = req.body.address3;

    conDb.query("INSERT INTO `edcmondb`.`users` (`address1`,`address2`,`address3`,`branch`,`enabled`,`is_login`,`password`,`username`,`email`,`avatar`)VALUES(?,?,?,?,?,?,?,?,?,?)", [address1, address2, address3, branch, enabled, 0, password, username, email, avatar], (err, rows, fields) => {
      if (!err) {

        if (rows.affectedRows > 0) {
          res.send(pesan.registerSucces);
        } else {
          res.status(400);
          res.send(pesan.registerGagal);
        }
      } else {
        var pesanError = Object.assign(pesan.gagalfetch, err);
        res.status(400);
        res.send(pesanError);
      }
    });
  } else {
    res.send(pesan.notAuthorized);
  }

});




module.exports = router;