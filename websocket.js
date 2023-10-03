
const { WebSocketServer } = require('ws')
const Player = require('./player')
// const { Player } = require('./player')


class WebSocket {
    constructor(port, createdbyid) {
        this.port = port
        this.createdbyid = createdbyid
        this.player1 = new Player()
        this.player2 = new Player()
        // this.clients = new Map([
        //     ['p1', undefined],
        //     ['p2', undefined]
        // ])
        this.connected = 0;
        this.markers = []
        this.socket = new WebSocketServer({ port: port })
        console.log("created socket at " + port)


        this.sockettimer = setTimeout(() => {
            console.log(this.connected)
            if (this.connected < 2) {
                this.socket.clients.forEach((client) => client.close())
                console.log(this.connected + "Exit")
                this.socket.close()
            }
        }, 1200000)
        // console.log(this.sockettimer._idleTimeout)

        this.socket.on("connection", (ws) => {

            if (this.connected > 1) {
                ws.close(1000, 'limit')
            } else {

                if (this.player1.client == undefined) {
                    ws.id = 1
                    ws.marker = this.getMarker()
                    console.log(this.markers, ws.marker)
                    this.player1.setPlayer(ws)
                }
                else {
                    ws.id = 2
                    ws.marker = this.getMarker()
                    console.log(this.markers, ws.marker)

                    this.player2.setPlayer(ws)
                }

                this.sendStatusOfPlayers()

                if (this.connected == 2) {
                    this.sendStatusOfPlayers()
                }
                ws.on('message', (message) => {
                    const data = JSON.parse(message)
                    if (data.status != undefined) {
                        console.log(data.status)
                        if (ws.id == 1) {
                            this.player1.setReady(data.status.ready)
                        } else {
                            this.player2.setReady(data.status.ready)
                        }
                        this.sendStatusOfPlayers()
                    }
                    if (data.move != undefined) {
                        this.sendToOtherPlayer(message, ws.id)
                    }
                })
                ws.on('close', async () => {
                    this.updateClientsCount(-1)
                    if (ws.id == 1) {
                        this.player1.disconnect()
                    }
                    else {
                        this.player2.disconnect()
                    }
                    this.sendStatusOfPlayers()
                    this.removeMarker(this.player1.marker)
                    console.log(this.markers)
                })
                this.updateClientsCount(1)
            }
        })
    }


    async removeMarker(marker) {
        // this.clients.get(player).status.connected = false
        this.markers = this.markers.filter((value) => value != marker)

        // this.clients.delete(player)
    }

    async sendStatusOfPlayers() {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({
                status: client.id == 1
                    ? {
                        opponent: this.player2.playerStatus(),
                        you: this.player1.playerStatus()
                    } : {
                        you: this.player2.playerStatus(),
                        opponent: this.player1.playerStatus()
                    }
            }))
        })
    }

    updateClientsCount(n) {
        if (this.connected + n == 0) {
            console.log("closed")
            this.socket.close()
        }
        this.connected += n
        if (this.connected == 2) {
            console.log("Timer Distroyed")
            clearTimeout(this.sockettimer)
        }
    }

    sendToOtherPlayer(message, senderid) {
        this.socket.clients.forEach((client) => {
            if (client.id != senderid) {
                console.log("Other")
                client.send(message.toString())
            }
        })
    }

    socketInfo() {
        console.log("info")
        return {
            'port': this.port,
            'connected': this.connected,
            'sockettime': this.sockettimer._idleTimeout
            // 'createdby': this.owner != undefined ? this.owner.name : ''
        }
    }

    getMarker() {
        let marker = ''
        if (this.markers.length == 0) {
            marker = ((Math.random().toFixed(1) * 10) % 2 == 1
                ? 'x'
                : 'o')
        }
        else {
            marker = (this.markers.includes('x')
                ? 'o'
                : 'x')
        }
        this.markers.push(marker)
        return marker
    }
}


// new WebSocket(1000)

module.exports = WebSocket
