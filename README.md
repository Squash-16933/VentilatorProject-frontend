# Ventilator Front-end
This is the front-end for the VentilatorProject. It's written in HTML/CSS/JS and uses the [Material Design Web](https://material.io/develop/web) framework.

## Setup
To compile Sass, `npm run sass`.

To compile ES6 JavaScript, `npm run babel`.

To test the website:
```
npm run sass
npm run babel
```

Then open `index.html` in a browser.

## Folder structure
- `css` Stylesheets
    - `compiled` Compiled Sass stylesheets
    - `sass` Sass stylesheets
        - `local` Stylesheets that aren't globally applied
- `js` JavaScript
    - `compiled` Compiled ES6
    - `babel` ES6