class Protocol {
    constructor() {
        this.version = '-1'
        this.socket  = new WebSocket('ws://localhost:3001');
        this.request = 0

        this.socket.onmessage = this.recieve
    }

    /**
     * Sends a request to the Pi.
     * @param {String} type Message type
     * @param {*} [data] Data to send (if there is data)
     */
    send(type, data=null) {
        var self = this

        // TODO Wait to send data until a recieval
        // Should I make this asynchronous?
        this.socket.send(JSON.stringify({
            type,
            version: self.version,
            request: self.request,
            timestamp: Math.floor(new Date().getTime()),
            data
        }))
        self.request++
    }

    recieve(event) {
        try {
            data = JSON.parse(event.data)
            console.log(data)
        } catch (e) { // If it's not in JSON format
            if (e instanceof SyntaxError) {
                console.log(event.data)
            } else throw e
        }

        protocol.send('power-on')
    }
}

var protocol = new Protocol()