# Ventilator Front-end
This is the front-end for the VentilatorProject. It's written in HTML/CSS/JS and uses the [Material Design Web](https://material.io/develop/web) framework.

## Setup
To test the website, run `npm start`, which builds the project, then opens `index.html` with the default browser.

To build without opening the project, run `npm build`.

To watch Sass for changes and compile them, run `npm watch-sass`.

To watch Babel for changes and compile them, run `npm watch-js`.

### Troubleshooting
If `npm foo` doesn't work, try `npm run foo`.

## Folder structure
- `css` Stylesheets
    - `sass` Stylesheets (Sass)
- `js` JavaScript (ES2015)
- `build` Compiled Sass and ES2015

## Troubleshooting (Sass)
Specify paths in Sass relative to the `build` directory.