// Note: working directory is root

const path = require('path')
const fs = require('fs')

/**
 * Changes a page's theme (e.g. light or dark).
 * @param {String} text Original text content
 * @param {String} theme Theme ID
 * @returns Text content of modified page
 */
module.exports.toTheme = (text, theme) => text.replace(/{{theme}}/g, theme)

/**
 * Changes a page's theme (e.g. light or dark).
 * @param {String} file Filepath of page
 * @param {String} theme Theme ID
 * @returns Text content of modified page
 */
module.exports.toThemeFile = (file, theme) => this.toTheme(fs.readFileSync(path.resolve(file), 'utf8'), theme)