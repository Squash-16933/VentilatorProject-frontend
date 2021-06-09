// Note: working directory is root

const HomeCtrl = require('./controllers/home')

module.exports = (app) => {
    app.get('/', HomeCtrl.get)
}