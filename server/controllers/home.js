// Note: working directory is root

const path = require('path')
const fs = require('fs')

// Get translation key from file
var transKey = JSON.parse(fs.readFileSync(path.resolve('./server/resources/lang.json')))

/**
 * Function for replaceAll that translates a page to a given language.
 * @param {String} lang ISO 3166-1 code for target language
 * @param {String} str String to translate
 */
function getTranslation(lang, str) {
    return str.replace(/{{([^}]+)}}/g, (match, p1, offset, string)=>transKey[p1][lang])
}

/**
 * Sends homepage with requested language.
 * @param {ReqIncomingMessage} req 
 * @param {ResServerResponse} res 
 */
module.exports.get = (req, res) => {
    try {
        // Log request
        console.log(`
Recieved request
Time:    ${new Date().toISOString()}
Request: GET ${req.url}`)

        var lang = req.params[0]

        res.set('Content-Type', 'text/html')
        res.status(200).send(
            getTranslation(lang, fs.readFileSync(path.resolve('./index.html'), 'utf8'))
        )

        // Log response
        console.log(`
Response to GET ${req.url}
Time:    ${new Date().toISOString()}
Status:  200`)
    } catch (e) { console.log(e) }
}

/**
 * Redirects the user to /en.
 * @param {ReqIncomingMessage} req 
 * @param {ResServerResponse} res 
 */
module.exports.getEn = (req, res) => { res.redirect('/en') }