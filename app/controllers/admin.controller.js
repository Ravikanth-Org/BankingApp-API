const Account = require('../models/account.model.js');
const user = require('../models/user.model.js');

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

exports.create = (req, res) => {

    if(!req.body.username || !req.body.password) {
        return res.status(400).send({
            message: "UserName/Password can not be empty"
        });
    }

    const usr = new user({
    userid: Math.random().toString().slice(2,11),
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    userDetails: {
        name: req.body.userDetails.name,
        dob: req.body.userDetails.dob,
        address: req.body.userDetails.address,
        city: req.body.userDetails.city,
        pin: req.body.userDetails.pin,
        phone: req.body.userDetails.phone
    }
    });


    usr.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error occurred while creating entry of the User."
        });
    });
};