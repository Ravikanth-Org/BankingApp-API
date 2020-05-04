const Account = require('../models/account.model.js');
const Users = require('./user.controller')
const user = require('../models/user.model')

exports.create = (req, res) => {

    if(!req.body.primaryowner|| !req.body.type) {
        return res.status(400).send({
            message: "Account owner and type can not be empty"
        });
    }

    const account = new Account({
        accountid: Math.random().toString().slice(2,11),
        type: req.body.type,
        joint: req.body.joint?req.body.joint:false,
        primaryowner: req.body.primaryowner,
        secondaryowner: req.body.secondaryowner?req.body.secondaryowner:'',
        branch: req.body.branch,
        balance: req.body.balance,
        currency: req.body.currency,
        createdDate: Date.now(),
        lastTransDate: Date.now(),
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

exports.searchAccountByUserId = (req,res) => {
    let userid = req.params.userid
    //validate
    if(!userid) {
        return res.status(400).send({
            message: 'Bad Request'
        });
    }
    let cond = {userid: userid} = req.body
    user.findOne(cond)
    .then(usr=>{
        if(!usr) {
            return res.status(404).send({
                message: "User does not exist in DB."
                });
        }
        let cond = {primaryowner:usr.userid} = req.body
        Account.findOne(cond)
        .then(acct => {
            if(!acct){
                return res.status(404).send({
                    message: "No matching Account."
                    });
            }
            return res.send(acct)
        })
    })
}


