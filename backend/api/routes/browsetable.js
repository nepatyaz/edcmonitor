const express = require('express');
const router = express.Router();

//browse all Tabel Satuan
router.get('/browse_tblsatuan',function(req, res) {
    conDb.query('SELECT * FROM tabelsatuan', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//browse all Tabel Agen
router.get('/browse_tblagen',function(req, res) {
    conDb.query('SELECT * FROM tabelagen', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//browse all Tabel Kecamatan
router.get('/browse_tblkecamatan',function(req, res) {
    conDb.query('SELECT * FROM tabelkecamatan', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//browse all Tabel Kelurahan
router.get('/browse_tblkelurahan',function(req, res) {
    conDb.query('SELECT * FROM tabelkelurahan', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;