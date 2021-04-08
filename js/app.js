class Handler {
    static h_getAll(response) {
        var humidity = document.querySelector('#stats-humidity .stat')
        humidity.innerHTML = Math.round(response.data.humidity/1024)+'<div class="stat-unit">%</div>'

        var pressure = document.querySelector('#stats-pressure .stat')
        pressure.innerHTML = Math.round(response.data.pressure/256)+'<div class="stat-unit">Pa</div>'

        var temperature = document.querySelector('#stats-temperature .stat')
        temperature.innerHTML = Math.round(response.data.temperature/100)+'<div class="stat-unit">°C</div>'
    }

    static h_getTime(response) {
        var time = document.querySelector('#stats-time .stat')
        time.innerHTML = response.data+'<div class="stat-unit">s</div>'
    }
}

class Protocol {
    constructor() {
        this.socket = new WebSocket('ws://localhost:5001');
        // this.socket = new WebSocket('ws://172.114.130.141:5000/socketserver');
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
    send(type, data = null, flags = null) { // Should I make this asynchronous?
        var msg = {
            type,
            version: this.version,
            request: this.request,
            timestamp: Math.floor(new Date().getTime()),
            data,
            flags
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
        this.send('getTime')
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
                    case 'getTime':
                        Handler.h_getTime(JSON.parse(event.data))
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

/* Handlers */
function controls_profile_submit() {
    if (controls_profile_valid()) {
        var data = {}

        // Age
        data.age = parseFloat(document.querySelector('#controls-profile-age-yr').value) + parseFloat(document.querySelector('#controls-profile-age-mo').value)/12

        // Height
        switch (document.querySelector('#controls-profile-height-unit').value) {
            case 'ft':
                data.height = document.querySelector('#controls-profile-height-ft-ft').value*12 + document.querySelector('#controls-profile-height-ft-in').value
            case 'cm':
                data.height = document.querySelector('#controls-profile-height-cm-cm').value/2.54
        }

        // Weight
        switch (document.querySelector('#controls-profile-weight-unit').value) {
            case 'lb':
                data.weight = document.querySelector('#controls-profile-weight').value
            case 'kg':
                data.weight = document.querySelector('#controls-profile-weight').value*0.45359237
        }

        protocol.send('setProfile', data)
    }
}

function controls_profile_valid() {
    var inputs = document.querySelectorAll('#controls-profile input')
    var valid = true

    inputs.forEach((e)=>{
        if (!e.validity.valid) {
            valid = false
        }
    })

    return valid;
}

function height_unit_changeUnit() {
    var value = document.querySelector('#controls-profile-height-unit').value
    var active
    var inactive

    if (value == 'ft') {
        active = document.querySelector('#controls-profile-height-ft')
        inactive = document.querySelector('#controls-profile-height-cm')
    } else if (value == 'cm') {
        active = document.querySelector('#controls-profile-height-cm')
        inactive = document.querySelector('#controls-profile-height-ft')
    }

    // Hide unnecessary input, show necessary one
    inactive.classList.add('inactive')
    inactive.classList.remove('active')
    inactive.querySelector('input').removeAttribute('required')
    
    active.classList.add('active')
    active.classList.remove('inactive')
    active.querySelector('input').setAttribute('required', 'required')
}

function weight_unit_changeUnit() {
    var value = document.querySelector('#controls-profile-weight-unit').value
    var element = document.querySelector('#controls-profile-weight')

    switch (value) {
        case 'lb': // Note: do not confuse lb and lbs
            element.setAttribute('placeholder', 'lbs')
            break
        case 'kg':
            element.setAttribute('placeholder', 'kg')
            break
        case 'st':
            element.setAttribute('placeholder', 'st')
            break
    }
}