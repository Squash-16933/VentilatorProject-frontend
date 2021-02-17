import Protocol from './protocol.js';

var protocol = new Protocol()

/* Handlers */
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
    
    active.classList.add('active')
    active.classList.remove('inactive')

    inactive.classList.remove('active')
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

function controls_profile_submit() {
    // to do - add this
}