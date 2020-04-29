module.exports = (app) => {
    const user = require('../controllers/user.controller.js');
    app.post('/user', user.create);
    app.get('/users', user.findAll);

    app.get('/user/:userId', user.findOne);
    app.put('/user/:userId', user.update);
    app.delete('/user/:userId', user.delete);
}