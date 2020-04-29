module.exports = (app) => {
    const users = require('../controllers/user.controller.js');


    app.post('/user', users.create);


    app.get('/users', users.findAll);


    app.get('/user/:userId', users.findOne);

    
    app.put('/user/:userId', users.update);

    
    app.delete('/user/:userId', users.delete);

       
    app.post('/user/login', users.userLogin);
}