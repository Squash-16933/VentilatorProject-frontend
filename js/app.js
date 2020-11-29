class Protocol {
    /**
     * Sends a request to the Pi.
     * @param {String} type Message type
     * @param {*} [data] Data to send (if there is data)
     */
    send(type, data=null) { // Should I make this asynchronous?
        var msg = {
            type,
            version: this.version,
            request: this.request,
            timestamp: Math.floor(new Date().getTime()),
            data
        }

        this.socket.send(JSON.stringify(msg))
        this.request++

        console.log('Sent:')
        console.log(msg)
        console.log()
    }

    /**
     * This listener triggers in response to the server sending its first message.
     */
    onReady() {
        protocol.send('powerOn')
    }

    /**
     * This listener triggers in response to recieval of a message.
     * @param {MessageEvent} event 
     */
    onRecieve(event) { // If you put send() in this, it gets stuck in a feedback loop
        try {
            var data = JSON.parse(event.data)
            console.log('Recieved:')
            console.log(data)
            console.log()

            if (!this.ready) {
                this.ready = true
                protocol.send('powerOn') // TODO Replace with this.onReady()
            }
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
        this.ready   = false // True if ready for sending messages

        this.socket.onmessage = this.onRecieve
    }
}

var protocol = new Protocol()