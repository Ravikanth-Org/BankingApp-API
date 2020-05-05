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
updateAccountBalance = async function(accountid, transAmt, credit, error)
{
    var accBal = 0
    let cond = {accountid: accountid}
    AcctMdl.findOne(cond)
    .then(acct => {
        if(!acct || acct.length===0){
            return({
                message: "Account not found"
            });
        }
        accBal = acct.balance;
        if(credit){
            accBal += transAmt;
        }else{
            accBal -= transAmt;
        }
        acct.balance = accBal
        AcctMdl.update(acct)
        /*AcctMdl.findOneAndUpdate({accountid: accountid},  {
            balance:accBal
        })*/
        return accBal
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Could not validate User!"
            });
        }
        return res.status(500).send({
            message: "Something went wrong. Try later "
        });
    });
    
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
exports.updateAccountNewTransaction = async function(req, res){
    let AccountTransaction = req.body

    if(!AccountTransaction || !AccountTransaction.accountId
        || !AccountTransaction.transAmt)
        {
            return res.status(400).send({
                message: "Bad Data"
            })
        }
        var accBal = 0
        accBal = await updateAccountBalance(AccountTransaction.accountId,
            AccountTransaction.transAmt, AccountTransaction.credit )

        console.log(accBal.json)
        let transObj = await new TxnMdl({
            transactionId: Math.random().toString().slice(2,11),
            accountId: AccountTransaction.accountId,
            transactiontime: Date.now(),
            status: "Success",
            balance: accBal,
            transAmount: AccountTransaction.transAmt,
            remarks: AccountTransaction.remarks,
            credit: AccountTransaction.credit,
            transtype: AccountTransaction.transtype,
            fromAcct: AccountTransaction.fromAcct,
            toAcct:AccountTransaction.toAcct,
            chequeNumber: AccountTransaction.chequeNumber
        })
        await transObj.save()
        .then(data => {
            res.status(200).send({message:"Account updated!"});
        }).catch(err => {
            res.status(500).send({
            message: err.message || "Error occurred while creating entry of the User."
        });
    });

}




