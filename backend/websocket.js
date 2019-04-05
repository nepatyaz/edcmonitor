const server = require('./server');

//socket io 
var clients = {};

io.sockets.on('connection', function (socket) {

    //panggil fungsi connected 
    connected();

    //fungsi untuk menampilkan pesan id socket user yang tersambung
    function connected() {
        // console.log("connected user : ", socket.id);
        getUser();
    }

    //set user kedalam mode online jika tersambung 
    socket.on('setUser', function (data) {
        clients[data.username] = {
            "socket": socket.id,
            "username": data.username
        };
        var sql = "UPDATE `users` SET `is_login` = '1' WHERE `users`.`username` = '" + data.username + "' ";
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("user", data.username, " set to online, in socket id : ", socket.id);
                getUser();
                // console.log("hasil kueri : ", result);
            } else {
                console.log("user", data.username, " fail set to online");
            }
        });
    });


    //fungsi untuk menset chat box , dan mengirimkan isi pesan ke user 
    socket.on('setChat', function (data) {
        var userName = data.userName;
        // var socketId = data.socketId;
        var toUser = data.toUser;

        console.log(clients);
        if (clients[userName]) {
            var sql = " SELECT * FROM message WHERE username = '" + userName + "' AND to_user = '" + toUser + "' UNION SELECT * FROM message WHERE username = '" + toUser + "' AND to_user = '" + userName + "' ORDER BY created_at ";
            // console.log("kueri yang dijalankan", sql);
            conDb.query(sql, (err, result) => {
                if (!err) {
                    io.sockets.connected[clients[userName].socket].emit("messageData" + userName, result);
                    // console.log("hasil kueri : ", result);
                } else {
                    io.sockets.connected[clients[userName].socket].emit("messageData" + userName, pesan.gagalfetch);
                }
            });
        } else {
            console.log("User does not exist: " + data.username);
        }
    });


    //fungsi untuk menerima kiriman pesan dan menyimpannya ke db
    socket.on('sendMessage', function (data) {
        let username = data.username;
        let message = data.message;
        let to_user = data.to_user;
        var sql = "INSERT INTO `message` ( `created_at`, `is_read`, `message`, `to_user`, `username`) VALUES ( NOW(), b'0', '" + message + "', '" + to_user + "', '" + username + "')";
        conDb.query(sql, (err, result) => {
            if (!err) {
                var sql = " SELECT * FROM message WHERE username = '" + username + "' AND to_user = '" + to_user + "' UNION SELECT * FROM message WHERE username = '" + to_user + "' AND to_user = '" + username + "' ORDER BY created_at ";
                conDb.query(sql, (err, result) => {
                    if (!err) {
                        console.log(username + " kirim pesan ke -> " + to_user);
                        // socket.emit("messageData" + username, result);
                        io.sockets.connected[clients[username].socket].emit("messageData" + username, result);
                        if (clients[to_user]) {
                            io.sockets.connected[clients[to_user].socket].emit("messageData" + to_user, result);
                        }
                    } else {
                        io.sockets.connected[clients[username].socket].emit("messageData" + username, pesan.gagalfetch);
                    }
                });
                console.log('message send');
            } else {
                console.log("message not send ");
            }
        });
    });

    //set pesan menjadi sudah dibaca 
    socket.on('setToRead', function (data) {
        console.log("data send : ", data.username);
        var sql = "UPDATE `message` SET `is_read` = b'1' WHERE `message`.`is_read` = b'0' and to_user = '" + data.to_user + "' and username = '" + data.username + "'";
        console.log(sql);
        conDb.query(sql, (err, result) => {
            if (!err) {
                console.log("set message to read : ");
            } else {
                console.log("set message to read fail ");
            }
        });
    });

    //dapatkan user 
    function getUser() {
        console.log("user get run");
        var sql = "SELECT id, is_login, name, username, avatar FROM users";
        conDb.query(sql, (err, result) => {
            if (!err) {
                // socket.emit('getUser', result);
                for (var name in clients) {
                    var username = clients[name].username;
                    io.sockets.connected[clients[username].socket].emit("getUser", result);
                }
            } else {
                console.log("get all user fail ");
            }
        });
    }


    //hapus data socket dan username, dari user yang sudah disconnect 
    socket.on('disconnect', function (data) {
        console.log(data);
        for (var name in clients) {
            if (clients[name].socket === socket.id) {
                var username = clients[name].username;
                console.log("client dihapus : ", username);
                delete clients[name];

                var sql = "UPDATE `users` SET `is_login` = '0' WHERE `users`.`username` = '" + username + "' ";
                conDb.query(sql, (err, result) => {
                    if (!err) {
                        console.log("user", username, " set to offline");
                        // console.log("hasil kueri : ", result);
                    } else {
                        console.log("user", username, " fail set to offline");
                    }
                });
                break;
            }
        }
        console.log(clients);
        getUser();
    });

    socket.on('getAdminStatus', function(){
        console.log('broadcast admin status');
        setInterval(() => {
            adminStatus();
        }, 5000);
    });

    function adminStatus(){
        var sql = "SELECT is_login FROM users WHERE username = 'admin'";
        conDb.query(sql, (err, result) => {
            if (!err) {
                io.emit('adminStatus', result );
            } else {
                console.log("Fail To Get User Status");
            }
        });
    }


    socket.on('disconnectUser', function (data) {
        for (var name in clients) {
            if (clients[name].socket === socket.id) {
                var username = clients[name].username;
                delete clients[name];

                var sql = "UPDATE `users` SET `is_login` = '0' WHERE `users`.`username` = '" + username + "' ";
                conDb.query(sql, (err, result) => {
                    if (!err) {
                        console.log("user", username, " set to offline");
                        // console.log("hasil kueri : ", result);
                    } else {
                        console.log("user", username, " fail set to offline");
                    }
                });
                break;
            }
        }
        console.log(clients);
        getUser();

    });

});