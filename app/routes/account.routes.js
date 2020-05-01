module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js');

    
    app.post('/api/account', accounts.create);
    

    app.get('/api/accounts', accounts.findAll);

}