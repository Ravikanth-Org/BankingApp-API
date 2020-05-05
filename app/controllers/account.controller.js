const AcctMdl = require('../models/account.model.js');
const UsrCtrl = require('./user.controller')
const UsrMdl = require('../models/user.model')
const TxnMdl = require('../models/transaction.model.js')

exports.create = (req, res) => {

    if(!req.body.primaryowner|| !req.body.type) {
        return res.status(400).send({
            message: "Account owner and type can not be empty"
        });
    }

    const account = new AcctMdl({
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
    AcctMdl.find()
    .then(account => {
        res.send(account);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of employees."
        });
    });
};

/*  =================================
    Search Account by User Id
====================================*/
exports.searchAccountByUserId = (req,res) => {
    let userid = req.params.userid
    //validate
    if(!userid) {
        return res.status(400).send({
            message: 'Bad Request'
        });
    }
    UsrMdl.find().where('userid').equals(userid)
    .then(usr => {
        if(!usr || usr.length===0) {
            return res.status(404).send({
                message: "User does not exist in DB."
                });
        }
        let cond = {primaryowner:userid}
        AcctMdl.findOne(cond)
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
/*===================================
    update Account Balance
===================================*/
updateAccountBalance = function(accountid, transAmt, credit, error)
{
    let accBal = 0
    AcctMdl.findOne({accountId: accountid })
    .then(acct => {
        if(!acct || acct.length===0){
            return({
                message: "Account not found"
            });
        }
        accBal = acct.accountbal;
        if(credit){
            accBal += transAmt;
        }else{
            accBal -= transAmt;
        }
        AcctMdl.findOneAndUpdate({accountid: accountId}, { $set: {
            balance:accBal
        }})
    })
    return accBal
}


exports.AccountTransaction = {
    accountId: Number,
    time: Date,
    status: String,
    remarks: String,
    transAmt: Number,
    credit: Boolean,
    transtype: String,
    fromAcct: Number,
    toAcct:Number,
    chequeNumber: Number
}
/*===================================
    Create New Transaction and Update Account Balance
===================================*/
exports.updateAccountNewTransaction = function(AccountTransaction, res) {
    if(!AccountTransaction || !AccountTransaction.accountId
        || !AccountTransaction.transAmt)
        {
            return res.status(400).send({
                message: "Bad Data"
            })
        }
        let accBal = updateAccountBalance(AccountTransaction.accountId,
            AccountTransaction.transAmt, AccountTransaction.credit )


        let transObj = new TxnMdl({
            transactionId: Math.random().toString().slice(2,11),
            accountId: AccountTransaction.accountId,
            transactiontime: Date.now(),
            status: "Success",
            balance: accBal,
            remarks: AccountTransaction.remarks,
            credit: AccountTransaction.credit,
            transtype: AccountTransaction.transtype,
            fromAcct: AccountTransaction.fromAcct,
            toAcct:AccountTransaction.toAcct,
            chequeNumber: AccountTransaction.chequeNumber
        })
        txn.save()
        .then(data => {
            res.status(200).send({message:"Account updated!"});
        }).catch(err => {
            res.status(500).send({
            message: err.message || "Error occurred while creating entry of the User."
        });
    });

}




