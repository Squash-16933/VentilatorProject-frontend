# Ventilator Front End
This is the front end for LeagueAir. It's written in HTML, Sass, and ES6.

## Setup
1. [Install NPM](https://www.npmjs.com/get-npm).
2. Type `npm i` to install the necessary packages.
3. To test the website, run `npm run server`, which builds the project and starts the server.
4. Then open `localhost:80/en`, which requests the English homepage.

### Other commands
- `npm run build`: Builds just the client side of the frontend.
- `npm run open`: Opens `./index.html`.

## Troubleshooting
### Troubleshooting (Sass)
Specify paths in Sass relative to the `build` directory.

### Troubleshooting (server)
Try resaving a file, which will cause the server to restart. Specify paths relative to the root.

## Folder structure
- **`assets`** Image resources
- **`build`** Compiled Sass and ES6
- **`css`** Stylesheets
    - **`fonts`** Font resources
    - **`sass`** Stylesheets (Sass)
      - `app.scss` Styles for `/index.html`
      - `components.scss` UI components
      - `typography.scss` Typography
      - `vars.scss` Global variables
    - `normalize.css` Normalizing styles for browsers
- **`js`** JavaScript (ES6)
    - `app.js` Scripts for `/index.html`
- **`server`** Server side of the frontend
  - **`controllers`** Respond to client requests
    - `home.js` Responds to homepage requests
  - **`resources`** Various resources
    - `lang.json` Translation key
  - `main.js` Starts the server
  - `routes.js` Routes requests to controllers
- `.babelrc` Babel config file
- `.gitignore` gitignore
- `index.html` Main page
- `package-lock.json` NPM package.json dependencies
- `package.json` NPM package.json file
- `NOTICE.md` Gives credit to various sources
- `protocol.md` Details the frontend-backend communication protocol
- `README.md` This file, the README

## Communication protocol
The communication protocol resembles a REST API, and the server (Raspberry Pi) communicates with the client (web app) via JSON.

*[Read more](./protocol.md)*

## Languages
The home page is requested in this format:
`GET /<language>`

`<language>` is a two letter ISO 639-1 code.

### Supported languaegs
- `en` English
- `es` Spanish