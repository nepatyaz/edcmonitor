var mysql=require('mysql');

var connection=mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'edcmondb',
    multipleStatements: true
});

connection.connect((err) => {
    if (!err) {
        console.log("Koneksi DB Oke");
    } else if (err) {
        console.log("Koneksi Gagal : " + JSON.stringify(err));
    }
});

module.exports = connection;