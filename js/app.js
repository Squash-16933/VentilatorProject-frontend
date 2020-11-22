class Protocol {
    /**
     * Sends a request to the Pi.
     * @param {String} type Message type
     * @param {*} [data] Data to send (if there is data)
     */
    send(type, data=null) {
        var self = this

        console.log({
            type,
            version: self.version,
            request: self.request,
            timestamp: Math.floor(new Date().getTime()),
            data
        })
        
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
            var data = JSON.parse(event.data)
            console.log(data)
        } catch (e) { // If it's not in JSON format
            if (e instanceof SyntaxError) {
                console.log(event.data)
            } else throw e
        }
    }

    constructor() {
        this.version = '-1'
        this.socket  = new WebSocket('ws://localhost:3001');
        this.request = 0

        this.socket.onmessage = this.recieve
    }
}

var protocol = new Protocol()