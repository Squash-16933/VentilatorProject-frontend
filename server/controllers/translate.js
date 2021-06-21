// Note: working directory is root

const path = require('path')
const fs = require('fs')

// Get translation key from file
var transKey = JSON.parse(fs.readFileSync(path.resolve('./server/resources/lang.json')))

/**
 * Translates a page.
 * @param {String} text Original text content
 * @param {String} lang ISO 3166-1 code for target language
 * @returns Text content of modified page
 */
module.exports.toLang = (text, lang) => {
    return text.replace(/{{([^}]+)}}/g, (match, p1, offset, string) => {
        if (transKey[p1] == undefined) { // If no match found
            return match // Do not replace
        } else return transKey[p1][lang] // Else, return translation
    })
}

/**
 * Translates a page.
 * @param {String} file Filepath of page
 * @param {String} lang ISO 3166-1 code for target language
 * @returns Text content of modified page
 */
module.exports.toLangFile = (file, lang) => this.toLang(fs.readFileSync(path.resolve(file), 'utf8'), lang)