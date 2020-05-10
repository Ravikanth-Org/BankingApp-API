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


exports.findAll = async function(req, res){
    try{
        const result = await AcctMdl.find()
        if(!result || result.length==0){
            res.status(500).send({message: 'Could not find Accounts !!!'})
        }else{
            res.status(200).send(result)
        }
    }catch(err){
        return res.status(500).send({message: 'Could not find Accounts !!!'})
    }
}

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
updateAccountBalance = async function(AccountTransaction)
{
    try{
        let cond = {accountid: AccountTransaction.accountId}
        let acct = await AcctMdl.findOne(cond)
        if(!acct){
            return {status:-1, error:'Could not find the Account!'}
        }
        accBal = acct.balance;
        if(AccountTransaction.credit){
            accBal += AccountTransaction.transAmt;
        }else{
            accBal -= AccountTransaction.transAmt;
        }
        acct.balance = accBal
        let updated = await AcctMdl.findOneAndUpdate(
            {accountid: AccountTransaction.accountId},
            { $set: {balance: accBal} },
            {new: true})

        if(!updated){
            return {status:-1, error:'Account update failed!'}
        }

        let transObj = new TxnMdl({
            transactionId: Math.random().toString().slice(2,11),
            accountId: AccountTransaction.accountId,
            time: Date.now(),
            status: AccountTransaction.status,
            balance: accBal,
            transAmount: AccountTransaction.transAmt,
            remarks: AccountTransaction.remarks,
            credit: AccountTransaction.credit,
            transtype: AccountTransaction.transtype,
            fromAcct: AccountTransaction.fromAcct,
            toAcct:AccountTransaction.toAcct,
            chequeNumber: AccountTransaction.chequeNumber
        })

        let saved = await transObj.save()

        if(!saved){
            return {status:-1, error:'Transaction could not be created!'}
        }

        return {status:0, error:''}
    }catch(err){
        return {status:-1, error:err.toString()}
    }
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
    if(!AccountTransaction ||
        !AccountTransaction.accountId ||
        !AccountTransaction.transAmt)
        {
            res.status(400).send({
                message: "Bad Data"
            })
        }
    try{
        result = await updateAccountBalance(AccountTransaction)
        result && result.status === 0 ? res.status(200).send({message:"Account Updated !"}) 
                                            : res.status(500).send({message:"Error updating"});
    }catch(err){
            res.status(500).send({message:"Error updating"+err})
    }
}

/*===================================
    Funds Transfer
===================================*/
exports.transferFunds = async function(req, res){
    try{
        const fromAcc = req.body.fromAcct
        const toAcc = req.body.toAcct
        const amt = req.body.transAmount

        let fromAccount = {
            accountId:fromAcc,
            status: "Success",
            remarks: "Amount Transferred",
            transAmt: amt,
            credit: false,
            transtype: "FundTransfer",
            fromAcct: fromAcc,
            toAcct:toAcc
        }

        let result1 = await updateAccountBalance(fromAccount)
        if(!result1 || result1.status !== 0){
            res.status(500).send({message:"Error updating"});
        }
        let toAccount = {
            accountId:toAcc,
            status: "Success",
            remarks: "Amount Received",
            transAmt: amt,
            credit: false,
            transtype: "FundTransfer",
            fromAcct: fromAcc,
            toAcct:toAcc
        }

        let result2 = await updateAccountBalance(toAccount)
        result2 && result2.status==0 ? res.status(200).send({message:"Funds Transferred!"}):
        res.status(200).send({message:"Funds Transferred!"})
    }catch(err){
        res.status(500).send({message:"Error during funds transfer: "+err})
    }
}
