const express = require('express');
const router = express.Router();

//login user
router.post("", function (req, res) {
    // console.log(req.body.username, req.body.password );
	console.log(req.headers['authorization'])
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT COUNT(username) as jumlah FROM `users` WHERE username = ? AND password = ? "
    console.log("Request permintaan user dengan username - password  : ", username, " - ", password);
    // console.log( enkripsi.enkrip(username));
    // console.log( enkripsi.dekrip('e529ce8d642332c6dcf527a850cd917d'));
   // const token = jwt.sign({
        //username: username,
       // loggedIn: true
   // }, 'secretkey', {
   //     expiresIn: 172800 // expire dalam 48 jam
  //  });
	



 //   console.log(token);

    conDb.query(sql, [username, password], (err, hasil) => {
        if (!err) {
            if (hasil[0].jumlah > 0) {
                let querycari = "select * from users where username = ? ";
                conDb.query(querycari, [username], (err, hasil2) => {
                    if (!err) {
						
						var querycarirole = "SELECT * FROM `users_roles` WHERE users_id = "+hasil2[0].id+"";
						 conDb.query(querycarirole ,  (err, hasil3) => {
						
							 
						var userName = hasil2[0].username;
                        var id = hasil2[0].id;
                        var name = hasil2[0].name;
						var email = hasil2[0].email;
						var address1 = hasil2[0].address1;
						var address2 = hasil2[0].address2;
						var address3 = hasil2[0].address3;
						var avatar = hasil2[0].avatar;
						var branch = hasil2[0].branch;
						var lastReset = hasil2[0].last_password_reset_date;
						var is_enabled = hasil2[0].enabled;
						var is_login = hasil2[0].is_login;
						var login = ( is_login ? true : false);
						var enabled = ( is_enabled ? true : false);
						
						
                        let objUser = {
                            "user": {
									"id": id,
									"name": name,
									"username": userName,
									"email": email,
									"avatar": avatar,
									"enabled": enabled,
									"branch": branch,
									"address1": address1,
									"address2": address2,
									"address3": address3,
									"lastPasswordResetDate": lastReset,
									"roles": [
										hasil3[0].roles
									],
								"login": login
							},
							//"token": token
                        };
                        //console.log(objUser);
						
                        res.status(200).send(objUser)
							  
						});
	
                    } else {
                        res.status(200).send({
                            message: "Login Gagal, operasi gagal dijalankan!", status : false
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

module.exports = router;