#! /bin/sh

# Remove build directory
[ -d './build' ]
rm -dr ./build

# Compile ES6
npx babel ./js -d ./build/js

# Compile Sass dark theme
sed "s/$theme: 1;/$theme: 0;/" -i -E ./css/sass/vars.scss
sass -s compressed ./css/sass:./build/css/theme0
cp ./css/normalize.css ./build/css/normalize.css

# Compile Sass light theme
sed "s/$theme: 0;/$theme: 1;/" -i -E ./css/sass/vars.scss
sass -s compressed ./css/sass:./build/css/theme1