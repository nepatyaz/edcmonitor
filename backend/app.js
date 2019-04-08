const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const crossDomain = require('./module/crossdomain');
const cekToken = require('./module/security');
const loger = require('./module/loger');
const message = require('./module/messages');


//konfigurasi koneksi database 
const db = require('./module/dbconnection');

//konfigurasi module sesuai route 
const cekloginRoutes = require('./api/routes/ceklogin');
const lurahRoutes = require('./api/routes/tbllurah');
const camatRoutes = require('./api/routes/tblcamat');
const barangRoutes = require('./api/routes/tblbarang');
const agenRoutes = require('./api/routes/tblagen');
const anggotaRoutes = require('./api/routes/tblanggota');
const browsetblRoutes = require('./api/routes/browsetable');
const user = require('./api/routes/user');
const authRoutes = require('./api/routes/authentification');

//konfigurasi global untuk mysql variabel
global.conDb = db
global.jwt = jwt
global.token = cekToken;
global.log = loger;
global.pesan = message;

//middle ware untuk menangkap data yang dikirimkan client 
app.use(crossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// Rute yang harus menangani permintaan
app.use('/ceklogin', cekloginRoutes);
app.use('/tbllurah', lurahRoutes);
app.use('/tblcamat', camatRoutes);
app.use('/tblbarang', barangRoutes);
app.use('/tblagen', agenRoutes);
app.use('/tblanggota', anggotaRoutes);
app.use('/browsetable', browsetblRoutes);
app.use('/user', user);
app.use('/login', authRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;