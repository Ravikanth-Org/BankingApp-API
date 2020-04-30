const Account = require('../models/account.model.js');

exports.create = (req, res) => {

    if(!req.body.owner|| !req.body.type) {
        return res.status(400).send({
            message: "Account owner and type can not be empty"
        });
    }

    const account = new Account({
        accountid: Math.random().toString().slice(2,11), 
        type: req.body.type,
        owner: req.body.owner,
        branch: req.body.branch,
        balance: req.body.balance,
        currency: req.body.currency,
        createdDate: Date().Now,
        lastTransDate: Date().Now,
        cheques: req.body.cheques
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


