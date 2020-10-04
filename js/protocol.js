// function sendGetPressure() {
//     socket.send({
//         type: "pressure",      // HTTP method
//         version: "10",         // TODO FIX THIS
//         request: 14893,        // Request ID
//         timestamp: 1600029468, // Unix timestamp
//         data: {                // Request data
//             pressure: 100
//         }
//     })
// } DO NOT USE THIS

socket.onmessage = function (event) {
    alert(event.data);
}

export class Protocol {
    version = 0

    socket
    request

    constructor() {
        socket = new WebSocket("ws://172.114.130.141:8080/socketserver");
        request = 0
    }

    /**
     * Sends a request to the Pi.
     * @param {String} type Message type
     * @param {*} [data] Data to send (if there is data)
     */
    send(type, data=null) {
        // Should I make this asynchronous?
        socket.send({
            type,
            version,
            request,
            timestamp: Math.floor(new Date().getTime()),
            data
        })
        request++
    }
}