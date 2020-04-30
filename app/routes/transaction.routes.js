module.exports = (app) => {
    const transactions = require('../controllers/transaction.controller.js');
    
    app.post('/trnx', transactions.create);
    app.get('/trnxs', transactions.findAll);

    app.get('/trnx/:transactionId', transactions.findOne);
    app.put('/trnx/:transactionId', transactions.update);
    app.delete('/trnx/:transactionId', transactions.delete);
}