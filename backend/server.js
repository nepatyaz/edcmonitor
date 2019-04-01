const http = require('http');
const app = require('./app');
const socketIO = require('socket.io');

const port = process.env.PORT || 3100;

const server = http.createServer(app);

if (server.listen(port)) {
    console.log("Server Berjalan Di Port : ", port);
} else {
    console.log("Server Gagal");
}

const io = socketIO(server);



//socket io 
var clients = {};

io.sockets.on('connection', function (socket) {

    console.log('a user connected', socket.id);
    socket.on('connect', function () {});

    socket.on('setUser', function (data) {
        clients[data.username] = {
            "socket": socket.id
        };
    });


    socket.on('setMessageData', function (msg) {
        var username = msg.username;
        var message = msg.message;
        var to_user = msg.to_user;

        console.log('username: ' + username);
        console.log('message: ' + message);
        console.log('to: ' + to_user);

        setInterval(function () {
            var sql = "SELECT * FROM message";
            conDb.query(sql, (err, result) => {
                if (!err) {
                    // socket.emit('messageData', result)
                    io.sockets.connected[clients[msg.username].socket].emit("messageData", result);
                    console.log("msgdata");
                } else {
                    socket.emit('messageData', err)
                }
            });
        }, 2000);
    });


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


    //Removing the socket on disconnect
    socket.on('disconnect', function () {
        for (var name in clients) {
            if (clients[name].socket === socket.id) {
                delete clients[name];
                break;
            }
        }
    })

});