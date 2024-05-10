

const express = require('express');
const WebSocket = require('./websocket');

const app = express();

var server = new Map()

function getRandomPort() {
    let port;
    do {
        port = (Math.random().toFixed(3) * 1000) + 8000
    } while (9999 == port || server.has(port));
    return port.toString();
}

app.get('/', (_, res) => {
    res.send("HI")
})

app.post('/creategamesocket', (req, res) => {
    console.log("Here")
    const port = getRandomPort()
    const createdbyid = (Math.random().toFixed(3) * 1000).toString()
    console.log(port, createdbyid)

    // create socket to connect
    server.set(port, new WebSocket(port, createdbyid))

    console.log(server)
    server.get(port).socket.addListener('close', () => {
        server.delete(port)
        console.log("{port}")
        console.log(server)
    })

    res.send({ port: port.toString(), createdbyid: createdbyid })
});


app.post('/joingamesocket', (req, res) => {
    console.log("joining")
    const port = req.headers.port
    console.log(port)
    if (server.has(port)) {
        res.send({ port: port.toString() })
    } else {
        res.send({ port: undefined })
    }

});


app.post('/portinfo', (req, res) => {
    const port = (server.get(req.headers.port))
    if (port) {
        const info = port.socketInfo()
        console.log(info)
        res.send(info)
    } else {
        console.log(port)
        res.send({
            'port': undefined,
            'connected': 0,
            'sockettime': 0
        })
    }
});

app.listen(9999, function () {
    console.log("Server started on port 9999");
});
