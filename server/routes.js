// Note: working directory is root

const ThemeCtrl = require('./controllers/theme')
const TransCtrl = require('./controllers/translate')

module.exports = (app) => {
    app.get('/', (req, res) => {
        // If no query params
        if (Object.keys(req.query).length == 0) {
            res.redirect('/?lang=en&theme=0')
            return
        }

        // If no lang, ?lang=en
        if (req.query['lang'] == undefined) {
            res.redirect(req.url+'&lang=en')
            return
        }

        // If no theme, ?theme=0
        if (req.query['theme'] == undefined) {
            res.redirect(req.url+'&theme=0')
            return
        }

        res.send(ThemeCtrl.toTheme(TransCtrl.toLangFile('./index.html', req.query['lang']), req.query['theme']))
    })
}