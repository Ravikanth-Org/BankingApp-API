module.exports = (app) => {
    const branch = require('../controllers/branch.controller.js');
    
    app.post('/api/branch', branch.create);
    app.get('/api/branches', branch.findAll);
}