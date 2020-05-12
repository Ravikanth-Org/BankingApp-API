module.exports = (app) => {
    const transactions = require('../controllers/transaction.controller.js');
    
    app.post('/api/trnx', transactions.create);
    app.get('/api/trnxs', transactions.findAll);

    app.get('/api/transaction/ministatement/:accountid',transactions.getMiniStatement)
    app.post('/api/transaction/detailedstatement',transactions.getDetailedStatement)

    app.get('/api/trnx/:transactionId', transactions.findOne);
    app.put('/api/trnx/:transactionId', transactions.update);
    app.delete('/api/trnx/:transactionId', transactions.delete);

    app.get('/api/trnxs/:accountId', transactions.findAll);
}