const express = require('express');
const router = express.Router();

numRows = 0;

//get all tabelkelurahan
router.get('/',function(req, res) {
    var tabelName = `Call get_tabellurah('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + [req.query.moffset] + `');`
    if (req.query.moffset < 0) {
        var tabelName = `Call get_tabellurah('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + 0 + `');`
    }
    conDb.query(tabelName, (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//add tabelkelurahan
router.post('/add_tbllurah/', function(req, res) {
    const tabelkelurahan = {
        namakecamatan: req.body.namakecamatan,
        namakelurahan: req.body.namakelurahan,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        kodepos: req.body.kodepos,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('INSERT INTO tabelkelurahan SET ?', tabelkelurahan, (err, result) => {
        if (!err) {
            res.status(200).json('Tambah Data Sukses');
            numRows++;
            var tabelcount = `Call update_tabelcountlurah('` + numRows + `');`
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
//view by id tabelkelurahan
router.get('/view_tbllurah/:id', (req, res) => {
   conDb.query('SELECT * FROM tabelkelurahan WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//update tabelkelurahan
router.post('/update_tbllurah/:id', function(req, res) {
    const tabelkelurahan = {
        namakecamatan: req.body.namakecamatan,
        namakelurahan: req.body.namakelurahan,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        kodepos: req.body.kodepos,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('UPDATE tabelkelurahan SET ? WHERE ?', [tabelkelurahan, {id: req.params.id}], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//delete by id tabelkelurahan
router.get('/delete_tbllurah/:id', (req, res) => {
    conDb.query('DELETE FROM tabelkelurahan WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Menghapus Data Sukses');
            numRows--;
            var tabelcount = `Call update_tabelcountlurah('` + numRows + `');`
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
//get search Tabel Kelurahan
router.get('/search_tbllurah',function(req, res) {
   
    var tabelTemp = `Call count_tabellurah('`+req.query.searchname+`');`
    conDb.query(tabelTemp, (err, rows, fields) => {
        if (!err) {
            console.log(rows[0])
            rows[0].forEach( (row) => {
                numRows = row.count
            });
            var tabelcount = `Call update_tabelcountlurah('`+numRows+`');`
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
//count tabelkelurahan
router.get('/count_tbllurah/:id', (req, res) => {
    conDb.query('SELECT countlurah FROM tabelcount WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//check nama kelurahan already exist
router.get('/check_tbllurah/', (req, res) => {

    if ([req.query.namakelurahan]==''){
        res.status(200).json("Nama Kelurahan harus diisi");
        return
    }
    if ([req.query.alamat1]==''){
        res.status(200).json("Alamat harus diisi");
        return
    }
    if ([req.query.kodepos]==''){
        res.status(200).json("Kode Pos harus diisi");
        return
    }
    if ([req.query.mfound]=='1'){
        res.status(200).json("");
        return
    }
    conDb.query('SELECT * FROM tabelkelurahan WHERE namakelurahan = ?', [req.query.namakelurahan], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Nama Kelurahan sudah pernah ada");
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;