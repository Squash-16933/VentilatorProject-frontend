class Handler {
    static h_getAll(response) {
        var humidity = document.querySelector('#humidity .stat')
        humidity.textContent = Math.round(response.data.humidity/10485.75)+'%'

        var pressure = document.querySelector('#pressure .stat')
        pressure.textContent = Math.round(response.data.pressure/10485.75)+'%'

        var temperature = document.querySelector('#temperature .stat')
        temperature.textContent = Math.round(response.data.temperature/655.35)+'%'
    }
}
class Protocol {
    constructor() {
        this.socket = new WebSocket('ws://localhost:5001'); // TODO connect this to pi instead
        this.request = 0
        this.ready = false // True if ready for sending messages

        this.version = '-1'
        this.requests = []

        this.socket.onmessage = (event) => this.onRecieve(event)
    }

    /**
     * Sends a request to the Pi.
     * @param {String} type Message type
     * @param {*} [data] Data to send (if there is data)
     */
    send(type, data = null) { // Should I make this asynchronous?
        var msg = {
            type,
            version: this.version,
            request: this.request,
            timestamp: Math.floor(new Date().getTime()),
            data
        }
        this.requests.push(msg)

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
        this.send('getAll')
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

            // Check if message is a response to a request
            if (data.request != undefined) {
                // TODO Improve by corresponding request num to start search index
                // Possibly search backwards?

                var corr

                // Search for corresponding request for recieved data
                for (var i = 0; i < this.requests.length; i++) {
                    if (this.requests[i].request == data.request) {
                        corr = this.requests[i]
                    }
                }

                // TODO make this handle more request types
                switch (corr.type) {
                    case 'getAll':
                        Handler.h_getAll(JSON.parse(event.data))
                        break
                }
            }

            // If server has not sent message before
            if (!this.ready) {
                this.ready = true
                this.onReady()
            }
        } catch (e) { // If it's not in JSON format
            if (e instanceof SyntaxError) {
                console.error('Error parsing JSON')
                console.error(event.data)
            } else throw e
        }
    }
}

var protocol = new Protocol()