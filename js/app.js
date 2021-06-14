/* Protocol */
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
        var time = response.data

        var dys = Math.floor(time/86400)
        time %= 86400
        var hrs = Math.floor(time/3600)
        time %= 3600
        var min = Math.floor(time/60)
        time %= 60
        var sec = time

        var el = document.querySelector('#stats-time .stat')
        el.innerHTML = ''

        if (dys > 0) {
            Handler.addTime(dys, 'd')
            Handler.addTime(hrs, 'h')
            Handler.addTime(min, 'm')
            Handler.addTime(sec, 's')
        } else if (hrs > 0) {
            Handler.addTime(hrs, 'h')
            Handler.addTime(min, 'm')
            Handler.addTime(sec, 's')
        } else if (min > 0) {
            Handler.addTime(min, 'm')
            Handler.addTime(sec, 's')
        } else {
            Handler.addTime(sec, 's')
        }
    }

    static addTime(num, unit) {
        var el = document.createElement('div')
        el.classList.add('stat-time-block')
        el.innerHTML = num+'<div class="stat-unit">'+unit+'</div>'

        document.querySelector('#stats-time .stat').appendChild(el)
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

/*  When page loads */
lang_arrange()

/**
 * Rearranges language selector.
 */
function lang_arrange() {
    var currLang = window.location.pathname.replace(/^\/?([a-z]{2})(.*)/, `$1`)
    var select = document.querySelector('#language-select')
    select.value = currLang
}

/**
 * Switches language in accordance with language selector.
 */
function lang_switch() {
    var select = document.querySelector('#language-select')
    window.location.pathname = window.location.pathname.replace(/^\/?([a-z]{2})(.*)/, `/${select.value}$2`)
}

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
            case 'st':
                data.weight = document.querySelector('#controls-profile-weight').value*14
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
    var active
    var inactive

    // Check if cm is inactive
    if (document.querySelector('#controls-profile-height-cm').classList.contains('inactive')) {
        // Switch cm to active one
        active = document.querySelector('#controls-profile-height-cm')
        inactive = document.querySelector('#controls-profile-height-ft')
    } else {
        // Switch ft to active one
        active = document.querySelector('#controls-profile-height-ft')
        inactive = document.querySelector('#controls-profile-height-cm')
    }

    // Hide unnecessary input, show necessary one
    inactive.classList.add('inactive')
    inactive.classList.remove('active')
    inactive.querySelector('input').removeAttribute('required')
    
    active.classList.add('active')
    active.classList.remove('inactive')
    active.querySelector('input').setAttribute('required', 'required')
}