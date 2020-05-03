const branch = require('../models/branch.model.js');


exports.create = (req, res) => {

    const bran = new branch({
        branchname: req.body.branchname
    });


    bran.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error occurred while creating entry of the branch."
        });
    });
};


exports.findAll = (req, res) => {
    branch.find()
    .then(branch => {
        res.send(branch);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of branch details."
        });
    });
};