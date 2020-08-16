# Ventilator Front-end
This is the front-end for the VentilatorProject. It's written in HTML/Sass/ES6.

## Setup
1. [Install NPM](https://www.npmjs.com/get-npm).
2. Type `npm i` to install the necessary packages.
3. To test the website, run `npm start`, which builds the project, then opens `index.html` with the default browser.

### Other commands
To build without opening the project, run `npm build`.

To watch Sass for changes and compile them, run `npm watch-sass`.

To watch Babel for changes and compile them, run `npm watch-js`.

### Troubleshooting
If `npm foo` doesn't work, try `npm run foo`.

## Folder structure
- `css` Stylesheets
    - `sass` Stylesheets (Sass)
- `js` JavaScript (ES6)
- `build` Compiled Sass and ES6

## Troubleshooting (Sass)
Specify paths in Sass relative to the `build` directory.
