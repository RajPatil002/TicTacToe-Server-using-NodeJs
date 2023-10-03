class Player {
    constructor() {
        this.marker = undefined
        this.ready = false
        this.connected = false
        this.client = undefined
    }

    setPlayer(client) {
        this.client = client
        this.marker = client.marker
        this.connected = true
    }

    setReady(value) {
        this.ready = value
    }

    disconnect() {
        this.marker = undefined
        this.ready = false
        this.connected = false
        this.client = undefined
    }

    playerStatus() {
        return {
            status: {
                ready: this.ready,
                connected: this.connected
            },
            marker: this.marker,
        }
    }


}


module.exports = Player