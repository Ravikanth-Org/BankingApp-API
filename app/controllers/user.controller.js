const user = require('../models/user.model.js');

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


exports.findOne = (req, res) => {
   
    user.find().where('userid').equals(req.params.userId)
    .then(usr => {
        if(!usr) {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });            
        }
        res.send(usr);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with userid " + req.params.userId
        });
    });
};


exports.update = (req, res) => {
    
    if(!req.body.username) {
        return res.status(400).send({
            message: "username name can not be empty"
        });
    }

    user.findOneAndUpdate({userid: req.params.userId}, { $set: { 
        password: req.body.password,
        userDetails: {
            address: req.body.userDetails.address,
            city: req.body.userDetails.city,
            pin: req.body.userDetails.pin,
            phone: req.body.userDetails.phone
    }
    }}, {new: true},function (err, usr) {
        
    }) 
 
    .then(usr => {
        if(!usr) {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });
        }
        res.send(usr);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating user details with given userid " + req.params.userId
        });
    });
};



exports.delete = (req, res) => {
    
    user.findOneAndDelete({userid: req.params.userId})
    .then(usr => {
        if(!usr) {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });
        }
        res.send({message: "User details deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with userid " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user details with userid " + req.params.userId
        });
    });
};