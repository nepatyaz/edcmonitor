var mysql=require('mysql');
//konfigurasi database mysql
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'datakoperasi',
    multipleStatements: true
});

db.connect((err) => {
    if (!err) {
        console.log("Koneksi OK");
    } else if (err) {
        console.log("Koneksi Gagal : " + JSON.stringify(err, undefined, 2));
    }
});

module.exports = db;
//end konfigurasi 
