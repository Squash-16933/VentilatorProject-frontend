# Ventilator Front-end
This is the front-end for the VentilatorProject. It's written in HTML/Sass/ES6.

## Setup
1. [Install NPM](https://www.npmjs.com/get-npm).
2. Type `npm i` to install the necessary packages.
3. To test the website, run `npm start`, which builds the project, then opens `index.html` with the default browser.

### Other commands
- `npm run build`: Builds the project without opening.
- `npm run open`: Opens the project without building.

## Troubleshooting (Sass)
Specify paths in Sass relative to the `build` directory.

## Folder structure
- `css` Stylesheets
    - `sass` Stylesheets (Sass)
- `js` JavaScript (ES6)
- `build` Compiled Sass and ES6

## Communication protocol
The communication protocol resembles a REST API, and the server (Raspberry Pi) communicates with the client (web app) via JSON.

*[Read more](./protocol.md)*