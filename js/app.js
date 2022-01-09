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

    static h_getResp(response) {
        var resp = response.data

        var el = document.querySelector('#stats-respiration .stat')
        el.innerHTML = resp
    }

    static h_getIE(response) {
        var resp = response.data

        var el = document.querySelector('#stats-ieratio .stat')
        el.innerHTML = resp
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
        // this.send('getAll')
        // this.send('getTime')
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
                    case 'getResp':
                        Handler.h_getResp(JSON.parse(event.data))
                        break
                    case 'getIE':
                        Handler.h_getIE(JSON.parse(event.data))
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
theme_arrange()
height_arrange()
weight_arrange()

/**
 * Returns the page's current language.
 * @returns ISO 3166-1 alpha-2 code
 */
function lang_current() {
    return new URL(window.location).searchParams.get('lang')
}

/**
 * Rearranges language selector.
 */
 function lang_arrange() {
    var select = document.querySelector('#language-select select')
    select.value = lang_current()
}

/**
 * Switches language in accordance with language selector.
 */
function lang_switch() {
    var select = document.querySelector('#language-select select')

    var url = new URL(window.location)
    url.searchParams.set('lang', select.value)

    window.location = url.href
}

/**
 * Sets proper icon for theme selector.
 */
function theme_arrange() {
    var theme = document.querySelector('#theme-select')
    var url = new URL(window.location)

    if (url.searchParams.get('theme') == 0) {
        theme.innerHTML = '<i class="icon fas fa-sun"></i>'
    } else {
        theme.innerHTML = '<i class="icon fas fa-moon"></i>'
    }
}

/**
 * Switches theme in accordance with theme selector.
 */
function theme_switch() {
    var url = new URL(window.location)

    if (url.searchParams.get('theme') == 0) {
        url.searchParams.set('theme', 1)
    } else {
        url.searchParams.set('theme', 0)
    }

    window.location = url.href
}

function controls_profile_submit() {
    if (controls_profile_valid()) {
        console.log('Yea, truly valid')
        var data = {}

        // Age
        data.age = parseInt(document.querySelector('#controls-profile-age-yr').value)*12 + parseInt(document.querySelector('#controls-profile-age-mo').value)

        // Height
        switch (height_unit_getUnit()) {
            case 'ft':
                data.height = parseInt(document.querySelector('#controls-profile-height-ft-ft').value)*12 + parseInt(document.querySelector('#controls-profile-height-ft-in').value)
                break
            case 'cm':
                data.height = document.querySelector('#controls-profile-height-cm-cm').value/2.54
                break
        }

        console.log('hgt-unit:')
        console.log(document.querySelector('#controls-profile-height-unit').value)

        console.log('hgt:')
        console.log(data.height)

        // Weight
        switch (weight_unit_getUnit()) {
            case 'lb':
                data.weight = document.querySelector('#controls-profile-weight').value
            case 'kg':
                data.weight = document.querySelector('#controls-profile-weight').value*0.45359237
        }

        // Gender
        data.gender = document.querySelector('#controls-profile-gender').value
        
        protocol.send('setProfile', data)
        // protocol.send('getResp') // Start getting respiration rate
        // protocol.send('getIE') // Start getting I:E ratio
    } else throw 'Patient profile is invalid'
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

/**
 * Switch to given height unit, or when left blank, toggles unit.
 * @param {String} target 'ft' or 'cm'
 */
function height_unit_changeUnit(target = null) {
    var active
    var inactive

    // Check if cm is target
    if (target == 'cm' || (target == null && height_unit_getUnit() == 'ft')) {
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

/**
 * Get the active height unit.
 * @returns {String} 'ft' or 'cm'
 */
function height_unit_getUnit() {
    return document.querySelector('#controls-profile-height-cm').classList.contains('inactive') ? 'ft' : 'cm'
}

/**
 * Rearranges height unit selector.
 */
 function height_arrange() {
    if (lang_current() == 'en') height_unit_changeUnit('ft')
    else height_unit_changeUnit('cm')
}

/**
 * Rearranges weight unit selector.
 */
 function weight_arrange() {
    if (lang_current() == 'en') document.querySelector('#controls-profile-weight-unit').value = 'lb'
    else document.querySelector('#controls-profile-weight-unit').value = 'kg'
}

/**
 * Get the active weight unit.
 * @returns {String} 'lb' or 'kg'
 */
function weight_unit_getUnit() {
    return document.querySelector('#controls-profile-weight-unit').value
}