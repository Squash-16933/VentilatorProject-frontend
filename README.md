# Ventilator Front-end
This is the front-end for the VentilatorProject. It's written in HTML/CSS/JS and uses the [Material Design Web](https://material.io/develop/web) framework.

## Setup
To test the website, run `npm start`, which builds the project, then opens `index.html` with the default browser.

To build without opening the project, run `npm build`.

### Troubleshooting
If `npm foo` doesn't work, try `npm run foo`.

## Troubleshooting (Sass)
Specify paths in Sass relative to the `build` directory.

## Folder structure
- `css` Stylesheets
    - `sass` Stylesheets (Sass)
- `js` JavaScript (ES2015)
- `build` Compiled Sass and ES2015

## Communication protocol
The communication protocol resembles a REST API, and the server (Raspberry Pi) communicates with the client (web app) via JSON.

*[Read more](./protocol.md)*