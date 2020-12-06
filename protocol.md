# Communication protocol
The communication protocol dictates the specifics of how the client and server interact and communicate through a websocket. See also: **Definitions**

It's based on HTTP ([RFC 7540](https://tools.ietf.org/html/rfc7540)) and JSON ([RFC 8259](https://tools.ietf.org/html/rfc8259)), and is still in its early stages. It's written in EcmaScript. See also: **Version numbers**

## Definitions
- The **client** is the computer (or if the server is on the same computer as the client, the specific app) that connects to the server with a websocket.
- The **server** (or **Pi**, even if it's not a Raspberry Pi) is the computer that operates the ventilator, responding to and executing requests from the client.
- **Sessions** (or **connections**) start when the client connects to the server with a websocket, and end when the websocket connection closes.
- **Requests** are requests sent from the client to the server. See also: **Request types > Naming convention > Definitions**
- **Request IDs** or **IDs** are identifying numbers unique for each request of a session. Two different requests should never be sent with the same ID in the same session.

## Request format
### Client
```js
{
    "type": "setPressure",      // Request type
    "version": 15,              // Protocol version
    "request": 14893,           // Request ID
    "timestamp": 1577836800000, // Unix timestamp
    "data": {                   // Request data
        "pressure": 100
    },
    "flags": {}                 // Request settings
}
```

`version` should be equal to the nth version, not the version number. For example, if the third version, `1.2001.0`, was released, it would be specified as `3`, not `1.2001.0`.

`request`, the request ID, should be 0 when the websocket connects, and then tick upward by one with each request.
#### Optimization
##### Hex
Still working on a way to include the data in this, and specify the protocol version.

`0f3a2d81916f5e66e800`
- `0f` Protocol version
- `3a 2d` Request ID
- `81 9` Request type
- `16 f5 e6 6e 80 0` Unix timestamp*

\* could be shortened

##### Minified
```json
["setPressure",18,14893,1577836800000,{"pressure":100}]
```

### Server
```js
{
    "request": 14893,          // Request ID to respond to
    "status": 200,             // HTTP-based status code (e.g. 200 OK)
    "data": 129050,            // Data from sensor (if data was requested)
    "timestamp": 1577836800000 // Unix timestamp (milliseconds)
}
```
If there was an error or it is responding without reading the message, the server might not send information like the time, data, or request ID.

#### Optimization
##### Hex
Still working on a way to include the data in this.
`3a2d0c801f81a16f5e66e800`
- `3a 2d` Request ID
- `0c 8` HTTP-based status code
- `01 f8 1a` Data from sensor
- `16 f5 e6 6e 80 0` Unix timestamp*

\* could be shortened by just eliminating the first 4 digits or so

##### Minified
```json
[14893,200,129050,1577836800000]
```

#### Handshake
When the server starts, it sends a short OK message to the client.
```js
{
    "status": 200,
    "timestamp": 1577836800000
}
```

## Examples
Here is a demo communication session:
```js
// Client connects
// Server notices connection and responds
{
    "status": 200
    "timestamp": 1577836800000 // Time is 1 Jan 2020, 00:00:00 (Unix 1577836800)
                               // Let's call it t = 0s
}

// Client sends request to get pressure
{
    "type": "pressureGet",
    "version": "0.2001.0",
    "request": 0,
    "timestamp": 1577836801000 // t = 1s
}

// Server sends continuous response
{
    "request": 0,
    "status": 200,             // HTTP-based status code (e.g. 200 OK)
    "data": 129050,
    "timestamp": 1577836802000 // t = 2s
}

{
    "request": 0,
    "status": 200,
    "data": 129120,
    "timestamp": 1577836802500 // t = 2.5s
}

{
    "request": 0,
    "status": 200,
    "data": 129120,
    "timestamp": 1577836803000 // t = 3s
}

// ...

// Client sends request to power off
{
    "type": "powerOff",
    "version": "0.2001.0",
    "request": 1,
    "timestamp": 1577836810000 // t = 10s
}

// Server completes request
{
    "request": 1,
    "status": 200,
    "timestamp": 1577836811000 // t = 11s
}
```

## Request types
### Naming convention
#### Definitions
- **Request types** (or **types**) are identifiers the summarize the action a request is trying to accomplish, like "turn on power", or "get current pressure".
    - Not to be confused with requests. Requests refer to individual messages sent by the client to the server. Each request has a request type.
- Each request type has a **method**. Its method relates to different properties of the request type. These are loosely based on HTTP request methods.
- **GET methods** apply to any request type that only fetch data, like the current pressure. They must not change anything.
    - Not to be confused with **GET request types**, which are request types that have the GET method. (e.g. `getHumidity` is a **GET request type** because it doesn't change anything and fetches data)
    - Also not to be confused with **GET requests**, which are requests that have a GET request type, therefore have the GET method, therefore must not change anything. (e.g. a request with a `getHumidity` type is a **GET request** because it doesn't change anything and fetches data)
- **POST methods** apply to any request type that must change something, like turning on the machine. They may also fetch data, like the current pressure, but they must change something.
    - Not to be confused with **POST request types**, which are request types that have the POST method. (e.g. `powerOn` is a **POST request type** because it changes something)
    - Also not to be confused with **POST requests**, which are requests that have a POST request type, therefore have the POST method, therefore must change something. (e.g. a request with a `powerOn` type is a **POST request** because it changes something)

#### Requirements
- Request types are named in camelCase, starting with a lowercase letter (e.g. `getHumidity`)
- Get request types must have `get` in their name (e.g. `getHumidity` or `getCurrentHumidity` or `humidityGet`)

## Documentation
### `getHumidity` - GET
Gets the current humidity.

#### Flags
- `continuous`
    
    **Defaults to `true`**

    When enabled, the server will send an update every 500ms.

#### Response
```js
{
    "data": 1048575 // Unsigned 20-bit number
}
```

### `getPressure` - GET
Gets the current pressure.

#### Flags
- `continuous`
    
    **Defaults to `true`**

    When enabled, the server will send an update every 500ms.

#### Response
```js
{
    "data": 1048575 // Unsigned 20-bit number
}
```

### `getTemp` - GET
Gets the current temperature.

#### Flags
- `continuous`
    
    **Defaults to `true`**

    When enabled, the server will send an update every 500ms.

#### Response
```js
{
    "data": 65535 // Unsigned 16-bit number
}
```

### `getAll` - GET
Requests a continuous update of all three.

#### Flags
- `continuous`
    
    **Defaults to `true`**

    When enabled, the server will send an update every 500ms.

#### Response
```js
{
    "data": {
        "humidity": 1048575, // Unsigned 20-bit number for humidity
        "pressure": 1048575, // Unsigned 20-bit number for pressute
        "temperature": 65535 // Unsigned 16-bit number for temperature
    }
}
```

### `powerOn` - POST
Turns on the ventilator.

### `powerOff` - POST
Turns off the ventilator.

## Version numbers
![CalVer MAJOR.YY0W.MICRO](https://img.shields.io/badge/calver-MAJOR.YY0W.MICRO-22bfda.svg)

- `MAJOR`: A version should be backwards-compatible with all the previous updates with the same `MAJOR` number (unless the number is `0`, which is the development phase).
- `YY`: A short year (the full year of the update minus 2000: e.g. `1012` for the year 3012 CE, `2` for the year 2002 CE)
- `0W`: Zero-padded week of the year of the update (`01` for the first week, `14` for the 14th week)
- `MICRO`: Update of the week (`0` for the first update of the week, `3` for the fourth update)
- `[-MODIFIER]`: Optionally appended `-alpha`, `-beta`, or similar

Version numbers use UTC.

If an update, however minor, is made to the external functionality of the protocol, it must increment one of the numbers. If the year, week, or `MAJOR` version has changed, it will be one or more of those numbers. The `MICRO` number must be reset to `0` when a different number than `MICRO` is changed.

### The exception
The protocol is still in stages so early, it doesn't even have a version number from this scheme. It can be referred to as Version -1: the pre-development phase. It is the only version number that is not unique for each change.

### Examples
If the project was still in its development stages, and a beta update was published on 2020-03-14 for the first time that week which changed backwards-compatibility:
- `0`: `MAJOR` would not increment even though the version was incompatible with earlier versions, since the project was still in development
- `20`: 2020 - 2000 = 20
- `11`: March 14 is in the 11th week of 2020
- `0`: First update that week
- `-beta`: Update is in beta
**`0.2011.0-beta`**

If the previous update was in version 2 and was incompatible, and an update was published for the third time that week on 2102-01-30:
- `3`: `MAJOR` would increment, since the update was incompatible with the previous update
- `102`: 2102 - 2000 = 102
- `05`: January 30 is the 5th week of 2102
- `2`: Third update that week
**`3.10205.2`**