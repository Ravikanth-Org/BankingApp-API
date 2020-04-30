const transaction = require('../models/transaction.model.js');

exports.create = (req, res) => {

    if(!req.body.accountid || !req.body.credit) {
        return res.status(400).send({
            message: "Account Id and Transaction Credit is required."
        });
    }

    const txn = new transaction({
        transactionId: Math.random().toString().slice(2,11),
        accountId: req.body.accountId,
        time: Date.now,
        status: req.body.status,
        balance: req.body.balance,
        remarks: req.body.remarks,
        credit: req.body.credit,
        transtype: req.body.transtype,
        fromAcct: req.body.fromAcct,
        toAcct:req.body.toAcct,
        chequeNumber: req.body.chequeNumber
    });


    txn.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error occurred while creating entry of the User."
        });
    });
};


exports.findAll = (req, res) => {
    transaction.find()
    .then(transaction => {
        res.send(transaction);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of transactions."
        });
    });
};


exports.findOne = (req, res) => {

    transaction.find().where('transactionid').equals(req.params.transactionId)
    .then(transaction => {
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction not found with transactionid " + req.params.transactionId
            });
        }
        res.send(transaction);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Transaction not found with transactionid " + req.params.transactionId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Transaction with transactionid " + req.params.transactionId
        });
    });
};


exports.update = (req, res) => {

    if(!req.body.transactionid) {
        return res.status(400).send({
            message: "transactionid can not be empty"
        });
    }
}
exports.delete = (req, res) => {

    transaction.findOneAndDelete({transactionId: req.params.transactionid})
    .then(transaction => {
        if(!transaction) {
            return res.status(404).send({
                message: "Transaction not found with transactionid " + req.params.transactionid
            });
        }
        res.send({message: "Transaction deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Transaction not found with transactionid " + req.params.transactionid
            });
        }
        return res.status(500).send({
            message: "Could not delete transaction details with transactionid " + req.params.transactionid
        });
    });
}