const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const http = require('http');
const crossDomain = require('./module/crossdomain');
const cekToken = require('./module/security');
const loger = require('./module/loger');
const message = require('./module/messages');


//konfigurasi koneksi database 
const db = require('./module/dbconnection');

//konfigurasi module sesuai route 
const user = require('./api/routes/user');
const authRoutes = require('./api/routes/authentification');
const device = require('./api/routes/device');

//konfigurasi global untuk mysql variabel
global.conDb = db
global.jwt = jwt
global.token = cekToken;
global.log = loger;
global.pesan = message;
global.http = http;

//middle ware untuk menangkap data yang dikirimkan client 
app.use(crossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// Rute yang harus menangani permintaan
app.use('/users', user);
app.use('/authenticate', authRoutes);
app.use('/device', device);

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