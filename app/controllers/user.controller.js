const user = require('../models/account.model.js');

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


exports.findAll = (req, res) => {
    user.find()
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of users."
        });
    });
};


