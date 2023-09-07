
const { WebSocketServer } = require('ws')


class WebSocket {
    constructor(port) {
        this.port = port
        this.clients = new Map()
        this.connected = 0;
        this.socket = new WebSocketServer({ port: port })
        this.socket.on("connection", (ws) => {
            if (this.connected > 1) {
                ws.close(1000, 'limit')
            } else {
                if (!this.clients.has('p1')) {
                    this.clients.set('p1', {});
                    ws.id = 1
                }
                else {
                    this.clients.set('p2', {});
                    ws.id = 2
                }
                this.updateClientsCount(1)
                ws.send('connected' + ws.id)
                ws.on('message', (message) => this.sendToOtherPlayer(message, ws.id))
                ws.on('close', () => {
                    this.updateClientsCount(-1)
                    ws.id == 1 ? this.clients.delete('p1') : this.clients.delete("p2")
                })
            }
        })
    }
    updateClientsCount(n) {
        this.connected += n
    }

    sendToOtherPlayer(message, id) {
        this.socket.clients.forEach((client) => {
            if (client.id != id) {
                client.send(message.toString())
            }
        })
    }

    socketInfo() {
        return {
            'port': this.port,
            'connected': this.connected,
        }
    }
}

new WebSocket(9000)

// module.exports = WebSocket
