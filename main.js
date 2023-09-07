

const express = require('express');
const WebSocket = require('./websocket');

const app = express();

let server = new Map()

function getRandomPort(){
    let port;
    do {
        port = (Math.random().toFixed(3) * 1000) + 9000
    } while (server.has(port));
    return port;
}

// app.get('/port', (req, res) => {
//     res.send(getRandomPort().toString())
//     server.set(port.toString(), new WebSocket(port))
//     console.log(server)
// });

app.post('/creategamesocket', (req, res) => {
    const port = getRandomPort()
    server.set(port.toString(), new WebSocket(port.toString()))
    res.send(port.toString())
    // console.log(server)
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
