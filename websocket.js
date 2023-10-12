
const { WebSocketServer } = require('ws')
const Player = require('./player')


class WebSocket {
    constructor(port, createdbyid) {
        this.port = port
        this.createdbyid = createdbyid
        this.player1 = new Player()
        this.player2 = new Player()
        this.turnid = undefined
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
        }, 120000)

        this.socket.on("connection", (ws) => {

            if (this.connected > 1) {
                console.log('try')
                ws.close(1000, 'limit')
            } else {

                if (this.player1.client == undefined) {
                    ws.id = 1
                    ws.marker = this.getMarker()
                    console.log(this.markers, ws.marker)
                    this.player1.setPlayer(ws)
                } else {
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
                    console.log(data)
                    if (data.status) {
                        this.turnid = undefined
                        console.log(data.status)
                        if (ws.id == 1) {
                            this.player1.setReady(data.status.ready)
                        } else {
                            this.player2.setReady(data.status.ready)
                        }
                        this.sendStatusOfPlayers()
                        if (this.turnid == undefined && this.player1.ready == true && this.player2.ready == true) {
                            this.sendStarting()
                        }
                    }
                    else if (data.move) {
                        this.sendMoveToOpponent(data, ws.id)
                    }
                })


                ws.on('close', async () => {
                    this.updateClientsCount(-1)
                    if (ws.id == 1) {
                        this.removeMarker(this.player1.marker)
                        this.player1.disconnect()
                    }
                    else {
                        this.removeMarker(this.player2.marker)
                        this.player2.disconnect()
                    }
                    this.sendStatusOfPlayers()
                    console.log(this.markers)
                })
                this.updateClientsCount(1)
            }
        })
    }


    removeMarker(marker) {
        this.markers = this.markers.filter((value) => value != marker)
    }

    async sendStatusOfPlayers() {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({
                players: client.id == 1
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

    changeTurn(lastturnid) {
        this.turnid = lastturnid == 1 ? 2 : 1
    }

    sendTurn() {
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({
                turn: this.turnid == client.id
            }))
        })

    }

    sendStarting() {
        this.socket.clients.forEach((client) => {
            console.log(client.marker)
            this.turnid = client.marker == 'x' ? client.id : undefined
            client.send(JSON.stringify({
                start: true,
                turn: client.marker == 'x',
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

    sendMoveToOpponent(move, senderid) {
        this.changeTurn(senderid)
        this.socket.clients.forEach((client) => {
            client.send(JSON.stringify({
                ...move,
                turn: this.turnid == client.id
            }))
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
