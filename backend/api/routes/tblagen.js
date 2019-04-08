const express = require('express');
const router = express.Router();

numRows = 0;

//get all tabelagen
router.get('/',function(req, res) {
    var tabelName = `Call get_tabelagen('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + [req.query.moffset] + `');`
    if (req.query.moffset < 0) {
        var tabelName = `Call get_tabelagen('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + 0 + `');`
    }
    conDb.query(tabelName, (err, rows, fields) => {
        if (!err) {
            console.log(rows[0])
            res.status(200).json(rows[0]);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//add tabelagen
router.post('/add_tblagen/', function(req, res) {

    const tabelagen = {
        kodeagen: req.body.kodeagen,
        namaagen: req.body.namaagen,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        nohandphone: req.body.nohandphone,
        email: req.body.email,
        namakelurahan: req.body.namakelurahan,
        namakecamatan: req.body.namakecamatan,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('INSERT INTO tabelagen SET ?', tabelagen, (err, result) => {
        if (!err) {
            res.status(200).json('Tambah Data Sukses');
            numRows++;
            var tabelcount = `Call update_tabelcountagen('` + numRows + `');`
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
//view by id tabelagen
router.get('/view_tblagen/:id', (req, res) => {
    conDb.query('SELECT * FROM tabelagen WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//update tabelagen
router.post('/update_tblagen/:id', function(req, res) {
    const tabelagen = {
        kodeagen: req.body.kodeagen,
        namaagen: req.body.namaagen,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        nohandphone: req.body.nohandphone,
        email: req.body.email,
        namakelurahan: req.body.namakelurahan,
        namakecamatan: req.body.namakecamatan,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('UPDATE tabelagen SET ? WHERE ?', [tabelagen, {id: req.params.id}], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//delete by id tabelagen
router.get('/delete_tblagen/:id', (req, res) => {
    conDb.query('DELETE FROM tabelagen WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Data sudah dihapus..');
            numRows--;
            var tabelcount = `Call update_tabelcountagen('` + numRows + `');`
            conDb.query(tabelcount, (err, rows) => {
                if (!err) {
                } else {
                    console.log("Query gagal, terjadi kesalahan" + err);
                }
            });
        } else {
            console.log("Delete Data Gagal !" + err);
        }
    });
});
//get search Tabel Agen
router.get('/search_tblagen',function(req, res) {
   
    var tabelTemp = `Call count_tabelagen('`+req.query.searchname+`');`
    conDb.query(tabelTemp, (err, rows, fields) => {
        if (!err) {
            console.log(rows[0])
            rows[0].forEach( (row) => {
                numRows = row.count
            });
            var tabelcount = `Call update_tabelcountagen('`+numRows+`');`
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
//check kode agen already exist
router.get('/check_tblagen/', (req, res) => {
    if ([req.query.kodeagen]==''){
        res.status(200).json("Kode Agen harus diisi");
        return
    }
    if ([req.query.namaagen]==''){
        res.status(200).json("Nama Agen harus diisi");
        return
    }
    if ([req.query.alamat1]==''){
        res.status(200).json("Alamat Agen harus diisi");
        return
    }
    if ([req.query.nohandphone]==''){
        res.status(200).json("Nomor Handphone harus diisi");
        return
    }
    if ([req.query.namakelurahan]==''){
        res.status(200).json("Nama Kelurahan harus diisi");
        return
    }
    if ([req.query.namakecamatan]==''){
        res.status(200).json("Nama Kecamatan harus diisi");
        return
    }
    if ([req.query.mfound]=='1'){
        res.status(200).json("");
        return
    }
    conDb.query('SELECT * FROM tabelagen WHERE kodeagen = ?', [req.query.mkodeagen], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Kode Barang sudah pernah digunakan");
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//count tabelagen
router.get('/count_tblagen/:id', (req, res) => {
    conDb.query('SELECT countagen FROM tabelcount WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;