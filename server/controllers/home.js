// Note: working directory is root

const path = require('path')
console.log(path.resolve('./index.html'))

module.exports.get = (req, res) => {
    try {
        res.status(200).sendFile(path.resolve('./index.html'))
    } catch (e) { console.log(e) }
}