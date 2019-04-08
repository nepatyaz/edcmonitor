const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

//cek sambungan server 
if (server.listen(port)) {
    console.log("Server Berjalan Di Port : ", port);
} else {
    console.log("Server Gagal");
}

//deklarasi socket
global.io = require('socket.io').listen(server);
const websocket = require('./websocket');
