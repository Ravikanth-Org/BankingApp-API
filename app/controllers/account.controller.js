const Account = require('../models/account.model.js');

exports.create = (req, res) => {

    if(!req.body.name) {
        return res.status(400).send({
            message: "Account name can not be empty"
        });
    }

    const account = new Account({
        accountNumber: Math.random().toString().slice(2,11), 
        accountName: req.body.name,
        openingDate: new Date()
    });

    
    account.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error occurred while creating entry of the Account."
        });
    });
};


exports.findAll = (req, res) => {
    Account.find()
    .then(account => {
        res.send(account);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of employees."
        });
    });
};


