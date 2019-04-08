const express = require('express');
const router = express.Router();


// //dapatkan semua data device 
router.get('/', (req, res) => {
    if (token.cekToken(req.headers['authorization'])) {
        var sql = "SELECT created_At, dvbrch, dvdown, dvdrch, dvdvid, dvloc1, dvloc2, dvloc3, dvmake, dvmodl, dvserl, id, latitude, longitude, report, update_At, userid FROM device";
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("kirim permintaan data devices");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        console.log("token not accepted");
        res.status(400);
        res.send(pesan.notAuthorized);
    }

});

//hapus data device by id
router.delete('/:id', (req, res) => {

    if (token.cekToken(req.headers['authorization'])) {
        var sql = "DELETE FROM `device` WHERE `device`.`id` = " + req.params.id + ""
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("delete device succes ");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        res.status(400);
        res.send(pesan.notAuthorized);
    }
});


// //dapatkan data device
router.get('/dvbrch', (req, res) => {
    if (token.cekToken(req.headers['authorization'])) {
        var sql = "SELECT * FROM device GROUP BY dvbrch";
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("data bybranch");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        res.send(pesan.notAuthorized);
    }
});

//dapatkan data device by branch
router.post('/search', (req, res) => {
    var branch = req.body.searchKey;
    if (token.cekToken(req.headers['authorization'])) {
        var sql = "SELECT * FROM device WHERE device.`dvbrch`='" + branch + "'";
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("device search bybranch");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        res.status(400);;
        res.send(pesan.notAuthorized);
    }
});
// 


//insert data device
router.post('/', (req, res) => {

    if (token.cekToken(req.headers['authorization'])) {

        var dvbrch = req.body.dvbrch;
        var dvdown = req.body.dvdown;
        var dvdrch = req.body.dvdrch;
        var dvdvid = req.body.dvdvid;
        var dvloc1 = req.body.dvloc1;
        var dvloc2 = req.body.dvloc2;
        var dvloc3 = req.body.dvloc3;
        var dvmake = req.body.dvmake;
        var dvmodl = req.body.dvmodl;
        var dvserl = req.body.dvserl;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;

        var sql = "insert into device (created_at, dvbrch, dvdown, dvdrch, dvdvid, dvloc1, dvloc2, dvloc3, dvmake, dvmodl, dvserl, latitude, longitude) values (now(), '" + dvbrch + "', '" + dvdown + "', '" + dvdrch + "', '" + dvdvid + "', '" + dvloc1 + "', '" + dvloc2 + "', '" + dvloc3 + "', '" + dvmake + "', '" + dvmodl + "', '" + dvserl + "', '" + latitude + "', '" + longitude + "')"
        // console.log(sql);
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("add device succes ");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        res.send(pesan.notAuthorized);
    }
});

//update data device by branch
router.put('/', (req, res) => {

    if (token.cekToken(req.headers['authorization'])) {

        let id = req.body.id;
        let dvbrch = req.body.dvbrch;
        let dvdown = req.body.dvdown;
        let dvdrch = req.body.dvdrch;
        let dvdvid = req.body.dvdvid;
        let dvloc1 = req.body.dvloc1;
        let dvloc2 = req.body.dvloc2;
        let dvloc3 = req.body.dvloc3;
        let dvmake = req.body.dvmake;
        let dvmodl = req.body.dvmodl;
        let dvserl = req.body.dvserl;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        let report = req.body.report;

        let sql;
        if (report === 'undefined' || report === '') {
            console.log('report kosng');
            sql = "update device set dvbrch='" + dvbrch + "', dvdown='" + dvdown + "', dvdrch='" + dvdrch + "', dvdvid='" + dvdvid + "', dvloc1='" + dvloc1 + "', dvloc2='" + dvloc2 + "', dvloc3='" + dvloc3 + "', dvmake='" + dvmake + "', dvmodl='" + dvmodl + "', dvserl='" + dvserl + "', latitude='" + latitude + "', longitude='" + longitude + "', report = NULL, update_at=now() where id='" + id + "'";
        } else {
            sql = "update device set dvbrch='" + dvbrch + "', dvdown='" + dvdown + "', dvdrch='" + dvdrch + "', dvdvid='" + dvdvid + "', dvloc1='" + dvloc1 + "', dvloc2='" + dvloc2 + "', dvloc3='" + dvloc3 + "', dvmake='" + dvmake + "', dvmodl='" + dvmodl + "', dvserl='" + dvserl + "', latitude='" + latitude + "', longitude='" + longitude + "', report = '" + report + "', update_at=now() where id='" + id + "'";
        }

        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("update device succes ");
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });
    } else {
        res.send(pesan.notAuthorized);
    }
});

// //dapatkan data device
router.get('/report/:id', (req, res) => {
    if (token.cekToken(req.headers['authorization'])) {

        var sql = "SELECT report FROM device WHERE id = " + req.params.id;
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("report data : ", result);
                res.send(result);
            } else {
                var pesanError = Object.assign(pesan.gagalfetch, err);
                res.send(pesanError);
            }
        });

    } else {
        res.send(pesan.notAuthorized);
    }
});





module.exports = router;