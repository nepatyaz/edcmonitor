const express = require('express');
const router = express.Router();

//login user
router.post("", function (req, res) {
    // console.log(req.body.username, req.body.password );
	console.log(req.headers['authorization'])
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT COUNT(username) as jumlah FROM `tabeluser` WHERE username = ? AND password = ? "
    console.log("Request permintaan user dengan username - password  : ", username, " - ", password);
    // console.log( enkripsi.enkrip(username));
    // console.log( enkripsi.dekrip('e529ce8d642332c6dcf527a850cd917d'));
    const token = jwt.sign({
        username: username,
        loggedIn: true
    }, 'kuncirahasia', {
        expiresIn: 86400 // expire dalam 24 jam
    });

    console.log(token);

    conDb.query(sql, [username, password], (err, hasil) => {
        if (!err) {
            if (hasil[0].jumlah > 0) {
                let querycari = "select * from tabeluser where username = ? ";
                conDb.query(querycari, [username], (err, hasil2) => {
                    if (!err) {
                        let user = hasil2[0].username;
                        let id = hasil2[0].id_user;
                        let email = hasil2[0].email;

                        let objUser = {
                            userid: id,
                            user: user,
                            email: email,
                            isLogin: true,
                            token: token
                        };
                        console.log("User OK");
                        res.status(200).send(objUser)
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