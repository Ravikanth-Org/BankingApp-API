const account = require('../controllers/account.controller.js');
const user = require ('./controllers/user.controller.js')

const adminroute  = {

    adminroute.post('/admin/createAccount')

}






module.exports = (app) => {
    const accounts = require('../controllers/account.controller.js');

    
    app.post('/accounts', accounts.create);
    

    app.get('/accounts', accounts.findAll);

}