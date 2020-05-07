module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js');

    
    app.post('/api/account', accounts.create);
    app.post('/api/account/newtransaction', accounts.updateAccountNewTransaction);
    app.post('/api/account/fundtransfer',accounts.transferFunds)

    app.get('/api/accounts', accounts.findAll);
    app.get('/api/account/:userid',accounts.searchAccountByUserId)
}