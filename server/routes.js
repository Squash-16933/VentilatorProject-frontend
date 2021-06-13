// Note: working directory is root

const HomeCtrl = require('./controllers/home')

module.exports = (app) => {
    app.get('', HomeCtrl.getEn)
    app.get('/', HomeCtrl.getEn)
    app.get(/\/([a-z]{2})/, HomeCtrl.get)
}