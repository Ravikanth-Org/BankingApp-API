module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js');
    const user = require('../controllers/user.controller.js');
    
    app.post('/api/newuseraccount', user.create, accounts.create);
    

}