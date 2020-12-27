function handleGetAll(data) {
    var humidity = document.querySelector('#humidity .stat')
    humidity.textContent = data.data.humidity

    var pressure = document.querySelector('#pressure .stat')
    pressure.textContent = data.data.pressure
    
    var temperature = document.querySelector('#temperature .stat')
    temperature.textContent = data.data.temperature
}
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
        protocol.send('getAll')
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

            // TODO Improve by corresponding request num to start search index
            // Possibly search backwards?

            var corr

            // Search for corresponding request for recieved data
            for (var i = 0; i < this.requests.length; i++) {
                if (this.requests[i].request == data.request) {
                    corr = this.requests[i].request
                }
            }

            // TODO make this handle more request types
            switch (corr.type) {
                case 'getAll':
                    handleGetAll(data)
                    break
            }

            if (!this.ready) {
                this.ready = true
                protocol.send('getAll') // TODO Replace with this.onReady()
            }
        } catch (e) { // If it's not in JSON format
            if (e instanceof SyntaxError) {
                console.log(event.data)
            } else throw e
        }
    }

    constructor() {
        this.version = '-1'
        this.socket  = new WebSocket('ws://172.114.130.141:5000/socketserver');
        this.request = 0
        this.ready   = false // True if ready for sending messages

        this.requests = []

        this.socket.onmessage = this.onRecieve
    }
}

var protocol = new Protocol()