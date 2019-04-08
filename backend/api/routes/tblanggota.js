const express = require('express');
const router = express.Router();

numRows = 0;

//get all tabelanggota
router.get('/',function(req, res) {
    var tabelName = `Call get_tabelanggota('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + [req.query.moffset] + `');`
    if (req.query.moffset < 0) {
        var tabelName = `Call get_tabelanggota('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + 0 + `');`
    }
    conDb.query(tabelName, (err, rows) => {
        if (!err) {
            console.log(rows[0])
            res.status(200).json(rows[0]);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//add tabelanggota
router.post('/add_tblanggota/', function(req, res) {
    var mtgllahir = new Date(req.body.tgllahir)
    const tabelanggota = {
        namaagen: req.body.namaagen,
        kodeanggota: req.body.kodeanggota,
        namaanggota: req.body.namaanggota,
        jeniskelamin: req.body.jeniskelamin,
        tempatlahir: req.body.tempatlahir,
        tgllahir: mtgllahir,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        nohandphone: req.body.nohandphone,
        email: req.body.email,
        namakepala: req.body.namakepala,
        nomorkk: req.body.nomorkk,
        noktpnik: req.body.noktpnik,
        namafoto: req.body.namafoto,
        kodeaktif: req.body.kodeaktif,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('INSERT INTO tabelanggota SET ?', tabelanggota, (err, result) => {
        if (!err) {
            res.status(200).json('Tambah Data Sukses');
            numRows++;
            var tabelcount = `Call update_tabelcountanggota('` + numRows + `');`
            conDb.query(tabelcount, (err, rows) => {
                if (!err) {
                } else {
                    console.log("Query gagal, terjadi kesalahan" + err);
                }
            });
        } else {
            console.log("bad query" + err);
        }
    });
});
//view by id tabelanggota
router.get('/view_tblanggota/:id', (req, res) => {
    conDb.query('SELECT * FROM tabelanggota WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//update tabelanggota
router.post('/update_tblanggota/:id', function(req, res) {
    var mtgllahir = new Date(req.body.tgllahir)
    const tabelanggota = {
        namaagen: req.body.namaagen,
        kodeanggota: req.body.kodeanggota,
        namaanggota: req.body.namaanggota,
        jeniskelamin: req.body.jeniskelamin,
        tempatlahir: req.body.tempatlahir,
        tgllahir: mtgllahir,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        nohandphone: req.body.nohandphone,
        email: req.body.email,
        namakepala: req.body.namakepala,
        nomorkk: req.body.nomorkk,
        noktpnik: req.body.noktpnik,
        namafoto: req.body.namafoto,
        kodeaktif: req.body.kodeaktif,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('UPDATE tabelanggota SET ? WHERE ?', [tabelanggota, {id: req.params.id}], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//delete by id tabelanggota
router.get('/delete_tblanggota/:id', (req, res) => {
    conDb.query('DELETE FROM tabelanggota WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Data sudah dihapus..');
            numRows--;
            var tabelcount = `Call update_tabelcountanggota('` + numRows + `');`
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
//get search Tabel Anggota
router.get('/search_tblanggota',function(req, res) {
    var tabelTemp = `Call count_tabelanggota('`+req.query.searchname+`');`
    conDb.query(tabelTemp, (err, rows, fields) => {
        if (!err) {
            rows[0].forEach( (row) => {
                numRows = row.count
            });
            console.log(numRows)
            var tabelcount = `Call update_tabelcountanggota('`+numRows+`');`
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
//count tabelanggota
router.get('/count_tblanggota/:id', (req, res) => {
    conDb.query('SELECT countanggota FROM tabelcount WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//check kode anggota already exist
router.get('/check_tblanggota/', (req, res) => {

    if ([req.query.kodeanggota]==''){
        res.status(200).json("Kode Anggota harus diisi");
        return
    }
    if ([req.query.namaanggota]==''){
        res.status(200).json("Nama Anggota harus diisi");
        return
    }
    if ([req.query.tempatlahir]==''){
        res.status(200).json("Tempat Lahir harus diisi");
        return
    }
    if ([req.query.tgllahir]==''){
        res.status(200).json("Tanggal Lahir harus diisi");
        return
    }
    if ([req.query.alamat1]==''){
        res.status(200).json("Alamat Anggota harus diisi");
        return
    }
    if ([req.query.nohandphone]==''){
        res.status(200).json("Nomor Handphone harus diisi");
        return
    }
    if ([req.query.namakepala]==''){
        res.status(200).json("Nama Kepala Keluarga harus diisi");
        return
    }
    if ([req.query.nomorkk]==''){
        res.status(200).json("Nomor KK Anggota harus diisi");
        return
    }
    if ([req.query.noktpnik]==''){
        res.status(200).json("Nomor KTP/NIK Anggota harus diisi");
        return
    }
    if ([req.query.namafoto]==''){
        res.status(200).json("Nama Foto harus diisi");
        return
    }
    if ([req.query.mfound]=='1'){
        res.status(200).json("");
        return
    }
    conDb.query('SELECT * FROM tabelanggota WHERE kodeanggota = ?', [req.query.mkodeanggota], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Kode Barang sudah pernah digunakan");
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;