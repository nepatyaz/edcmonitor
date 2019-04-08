const express = require('express');
const router = express.Router();

numRows = 0;

//get all tabelbarang
router.get('/',function(req, res) {
    var tabelName = `Call get_tabelbarang('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + [req.query.moffset] + `');`
    if (req.query.moffset < 0) {
        var tabelName = `Call get_tabelbarang('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + 0 + `');`
    }
    conDb.query(tabelName, (err, rows, next) => {
        if (!err) {
            console.log(rows[0])
            res.status(200).json(rows[0]);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//add tabelbarang
router.post('/add_tblbarang/', function(req, res) {
    const tabelbarang = {
        kodebarang: req.body.kodebarang,
        namabarang: req.body.namabarang,
        satuan: req.body.satuan,
        hargasatuan: req.body.hargasatuan,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('INSERT INTO tabelbarang SET ?', tabelbarang, (err, result) => {
        if (!err) {
            res.status(200).json('Tambah Data Sukses');
            numRows++;
            var tabelcount = `Call update_tabelcountbarang('` + numRows + `');`
            conDb.query(tabelcount, (err, rows) => {
                if (!err) {
                } else {
                    console.log("Query gagal, terjadi kesalahan" + err);
                }
            });
        } else {
            console.log("Tambah Data Gagal !" + err);
        }
    });
});
//view by id tabelbarang
router.get('/view_tblbarang/:id', (req, res) => {
    conDb.query('SELECT * FROM tabelbarang WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//update tabelbarang
router.post('/update_tblbarang/:id', function(req, res) {
    const tabelbarang = {
        kodebarang: req.body.kodebarang,
        namabarang: req.body.namabarang,
        satuan: req.body.satuan,
        hargasatuan: req.body.hargasatuan,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('UPDATE tabelbarang SET ? WHERE ?', [tabelbarang, {id: req.params.id}], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//delete by id tabelbarang
router.get('/delete_tblbarang/:id', (req, res) => {
    conDb.query('DELETE FROM tabelbarang WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
            numRows--;
            var tabelcount = `Call update_tabelcountbarang('` + numRows + `');`
            conDb.query(tabelcount, (err, rows) => {
                if (!err) {
                } else {
                    console.log("Query gagal, terjadi kesalahan" + err);
                }
            });
        } else {
            console.log("Menghapus Data Gagal !" + err);
        }
    });
});
//get search Tabel Barang
router.get('/search_tblbarang',function(req, res) {
   
    var tabelTemp = `Call count_tabelbarang('`+req.query.searchname+`');`
    conDb.query(tabelTemp, (err, rows, fields) => {
        if (!err) {
            rows[0].forEach( (row) => {
                numRows = row.count
            });
            var tabelcount = `Call update_tabelcountbarang('`+numRows+`');`
            conDb.query(tabelcount, (err, rows) => {
                if (!err) {
                } else {
                    console.log("Query gagal, terjadi kesalahan" + err);
                }
            });
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//count tabelbarang
router.get('/count_tblbarang/:id', (req, res) => {
    conDb.query('SELECT countbarang FROM tabelcount WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//check kode barang already exist dan validasi input
router.get('/check_tblbarang/', (req, res) => {
   
    if ([req.query.mkodebarang]==''){
        res.status(200).json("Kode Barang harus diisi");
        return
    }
    if ([req.query.mnamabarang]==''){
        res.status(200).json("Nama Barang harus diisi");
        return
    }
    if ([req.query.msatuan]==''){
        res.status(200).json("Satuan harus diisi");
        return
    }
    if ([req.query.mhargasatuan]==''){
        res.status(200).json("Harga Satuan harus diisi");
        return
    }
    if ([req.query.mfound]=='1'){
        res.status(200).json("");
        return
    }
    conDb.query('SELECT * FROM tabelbarang WHERE kodebarang = ?', [req.query.mkodebarang], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Kode Barang sudah pernah digunakan");
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//Get all records tabelbarang for print to excel
router.get('/print_tblbarang/',function(req, res) {
    
    var tabelName = `SELECT * FROM tabelbarang;`
    conDb.query(tabelName, (err, rows) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;