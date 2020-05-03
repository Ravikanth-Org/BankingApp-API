module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    app.post('/api/user', user.create);
    app.get('/api/users', user.findAll);

       
    app.post('/api/user/login', user.userLogin);
    app.get('/api/user/:userId', user.findOne);
    app.put('/api/user/:userId', user.update);
    app.delete('/api/user/:userId', user.delete);

    app.get('/api/users/:name', user.findOne);
}