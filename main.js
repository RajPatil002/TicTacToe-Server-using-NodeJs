

const express = require('express');
const WebSocket = require('./websocket');

const app = express();

let server = new Map()

function getRandomPort() {
    return 9000//(Math.random().toFixed(3) * 1000) + 9000
}

app.get('/', (req, res) => {
    const port = getRandomPort()
    res.send(port.toString())
    server.set(port.toString(), new WebSocket(port))
    console.log(server)
});

app.post('/portinfo', (req, res) => {
    res.send(server.get(req.headers.port).socketInfo())
});

app.listen(9999, function () {
    console.log("Server started on port 9999");
});

// sockserver.on('connection', (ws) => {
//     console.log("connected")
//     ws.send("connected to server")
//     console.log(sockserver.clients.size)
//     ws.on('message', function (data) { 
//         const str = JSON.parse(data)
//         console.log(str.message.toString())
//      })
// })
