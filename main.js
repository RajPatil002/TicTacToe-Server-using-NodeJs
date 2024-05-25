

const express = require('express');
const WebSocket = require('./websocket');

const app = express();
app.use(express.json())

var server = new Map()

function getRandomPort() {
    let port;
    do {
        port = (Math.random().toFixed(3) * 1000) + 8000
    } while (9999 == port || server.has(port));
    return port.toString();
}


app.get('/', (q, s) => {
    s.send("Hi from SERVER")
})

app.post('/creategamesocket', (req, res) => {
    console.log("Here")
    const port = getRandomPort()
    const createdbyid = (Math.random().toFixed(3) * 1000).toString()
    console.log(port, createdbyid)

    // create socket to connect
    server.set(port, new WebSocket(port, createdbyid))

    console.log(server.keys())
    server.get(port).socket.addListener('close', () => {
        server.delete(port)
        console.log("{port}")
        console.log(server.keys())
    })

    res.send({ port: port.toString(), createdbyid: createdbyid })
});



app.post('/portinfo', (req, res) => {
    console.log(req.body);
    const port = (server.get(req.body.port))
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

server.set("1000", new WebSocket(1000, 0))