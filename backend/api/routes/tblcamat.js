const express = require('express');
const router = express.Router();

numRows = 0;

//get all tabelkecamatan
router.get('/',function(req, res) {
    var tabelName = `Call get_tabelcamat('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + [req.query.moffset] + `');`
    if (req.query.moffset < 0) {
        var tabelName = `Call get_tabelcamat('` + [req.query.msearch] + `','` + global.pageDefault + `', '` + 0 + `');`
    }
    conDb.query(tabelName, (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//add tabelkecamatan
router.post('/add_tblcamat/', function(req, res) {
    const tabelkecamatan = {
        namakecamatan: req.body.namakecamatan,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('INSERT INTO tabelkecamatan SET ?', tabelkecamatan, (err, result) => {
        if (!err) {
            res.status(200).json('Tambah Data Sukses');
            numRows++;
            var tabelcount = `Call update_tabelcountcamat('` + numRows + `');`
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
//view by id tabelkecamatan
router.get('/view_tblcamat/:id', (req, res) => {
   conDb.query('SELECT * FROM tabelkecamatan WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//update tabelkecamatan
router.post('/update_tblcamat/:id', function(req, res) {
    const tabelkecamatan = {
        namakecamatan: req.body.namakecamatan,
        alamat1: req.body.alamat1,
        alamat2: req.body.alamat2,
        username:"Budisan",
        tglentry:new Date(),
    };
    conDb.query('UPDATE tabelkecamatan SET ? WHERE ?', [tabelkecamatan, {id: req.params.id}], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Merubah Data Sukses');
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//delete by id tabelkecamatan
router.get('/delete_tblcamat/:id', (req, res) => {
    conDb.query('DELETE FROM tabelkecamatan WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json('Menghapus Data Sukses');
            numRows--;
            var tabelcount = `Call update_tabelcountcamat('` + numRows + `');`
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
//get search Tabel Kecamatan
router.get('/search_tblcamat',function(req, res) {
   
    var tabelTemp = `Call count_tabelcamat('`+req.query.searchname+`');`
    conDb.query(tabelTemp, (err, rows, fields) => {
        if (!err) {
            console.log(rows[0])
            rows[0].forEach( (row) => {
                numRows = row.count
            });
            var tabelcount = `Call update_tabelcountcamat('`+numRows+`');`
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
//count tabelkecamatan
router.get('/count_tblcamat/:id', (req, res) => {
    conDb.query('SELECT countcamat FROM tabelcount WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//check nama kecamatan already exist
router.get('/check_tblcamat/', (req, res) => {

    if ([req.query.namakecamatan]==''){
        res.status(200).json("Nama Kecamatan harus diisi");
        return
    }
    if ([req.query.alamat1]==''){
        res.status(200).json("Alamat harus diisi");
        return
    }
    if ([req.query.mfound]=='1'){
        res.status(200).json("");
        return
    }
    conDb.query('SELECT * FROM tabelkecamatan WHERE namakecamatan = ?', [req.query.namakecamatan], (err, rows, fields) => {
        if (!err) {
            res.status(200).json("Nama Kecamatan sudah pernah ada");
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});
//Get all records tabelkecamatan for print to excel
router.get('/print_tblcamat/',function(req, res) {
    
    var tabelName = `SELECT * FROM tabelkecamatan;`
    conDb.query(tabelName, (err, rows) => {
        if (!err) {
            res.status(200).json(rows);
        } else {
            console.log("Query gagal, terjadi kesalahan" + err);
        }
    });
});

module.exports = router;

// Delete file if already exist
// const fileExists = require('file-exists');            --> ketik diline atas
// fileExists('./tabelkecamatan.xlsx').then(exists => {
//     console.log(exists) // OUTPUTS: true or false
//     fs.unlinkSync('./tabelkecamatan.xlsx')
// })

//print to excel Tabel Kecamatan di sisi server node.js
// const Excel = require('exceljs');                     --> ketik diline atas
// router.get('/print_tblcamat/',function(req, res) {
    
//     var workbook = new Excel.Workbook()
//     var border = {top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'}}
//     var font = { name: 'Calibri', size: 11, bold: true }
    
//     // Create a sheet
//     var sheet = workbook.addWorksheet('Sheet1');
//     // A table header
//     sheet.columns = [
//         { header: 'Id', key: 'id', width: 6 },
//         { header: 'Nama Kecamatan', key: 'namakecamatan', width: 25 },
//         { header: 'Alamat1', key: 'alamat1', width: 25 },
//         { header: 'Alamat2', key: 'alamat2', width: 25, }
//     ];

//     ['A1', 'B1', 'C1', 'D1'].map(key => {
//         sheet.getCell(key).fill = { type: 'pattern', pattern:'solid', fgColor:{argb:'cccccc'} };
//     });
//     ['A1', 'B1', 'C1', 'D1'].map(key => {
//         sheet.getCell(key).alignment = {vertical: 'middle',horizontal: 'center'};
//     });

//     sheet.getCell('A1').font = font
//     sheet.getCell('B1').font = font
//     sheet.getCell('C1').font = font
//     sheet.getCell('D1').font = font
    
//     sheet.getCell('A1').border = border
//     sheet.getCell('B1').border = border
//     sheet.getCell('C1').border = border
//     sheet.getCell('D1').border = border
//     sheet.getRow(1).height = 24

//     var tabelName = `SELECT * FROM tabelkecamatan;`
//     conDb.query(tabelName, (err, rows) => {
//         if (!err) {
//             for (var i = 0; i < rows.length; i++) {
//                 sheet.addRow({id: rows[i].id, namakecamatan: rows[i].namakecamatan, alamat1: rows[i].alamat1, alamat2:rows[i].alamat2 });
//                 sheet.getCell('A'+i).border = border
//                 sheet.getCell('B'+i).border = border
//                 sheet.getCell('C'+i).border = border
//                 sheet.getCell('D'+i).border = border
//             }
//             sheet.getCell('A'+i).border = border
//             sheet.getCell('B'+i).border = border
//             sheet.getCell('C'+i).border = border
//             sheet.getCell('D'+i).border = border
//             sheet.getCell('A'+(i+1)).border = border
//             sheet.getCell('B'+(i+1)).border = border
//             sheet.getCell('C'+(i+1)).border = border
//             sheet.getCell('D'+(i+1)).border = border      
//             workbook.xlsx.writeFile("tabelkecamatan.xlsx")
            
//         } else {
//             console.log("Query gagal, terjadi kesalahan" + err);
//         }
//     });
// });