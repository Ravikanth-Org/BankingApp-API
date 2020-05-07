const TxnModel = require('../models/transaction.model.js');

exports.create = (req, res) => {

    if(!req.body.accountId || !req.body.credit) {
        return res.status(400).send({
            message: "Account Id and Transaction Credit is required."
        });
    }

    const txn = new TxnModel({
        transactionId: Math.random().toString().slice(2,11),
        accountId: req.body.accountId,
        time: Date.now(),
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
    
    if(req.params.accountId){
        TxnModel.find().where('accountId').equals(req.params.accountId)
        .then(txn => {
            if(txn.length === 0) {
                return res.status(404).send({
                    message: "No transactions found."
                });
            }
            res.send(txn);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "No transactions found."
                });
            }
            return res.status(500).send({
                message: "Error retrieving transaction details."
            });
        });
    }else{
    
    TxnModel.find()
    .then(transaction => {
        res.send(transaction);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving details of transactions."
        });
    });
}
};


exports.findOne = (req, res) => {

    TxnModel.find().where('transactionId').equals(req.params.transactionId)
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

    TxnModel.findOneAndDelete({transactionId: req.params.transactionid})
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

exports.getMiniStatement = async function(req, res){
    try {
        const accountid = req.params.accountid
        TxnModel.find({accountId: accountid}).sort({createdAt:'descending'}).limit(10)
        .then( txns => {
            if(!txns || txns.length === 0){res.status(500).send({message: "Transactions Not Found!"})}
            res.send(txns)
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal Error"+error})
    }
}


/*===================================
    detailed statement
===================================*/
exports.getDetailedStatement = async function(req,res){
    let searchObj = req.body
    try{
        if(!searchObj ||
            !searchObj.accountId ||
            !searchObj.criteria)
            {
                res.status(400).send({
                    message: "Bad Data"
                })
            }
        switch(searchObj.criteria){
            case 'DATE-RANGE' :  let result = await getTransactionListByDateRange(searchObj)
                                    result && result.status === 0 ? res.status(200).send(result.transList):
                                                                    res.status(500).send(result.err)
                    break
            case '' : break
            case '' : break
            case '' : break
            case '' : break
            default:    res.status(500).send({message: 'Unsupported search criteria'})
        }

    }catch(err){
        res.status(500).send({message:"Error get statement"+err})
    }

}

getTransactionListByDateRange = async function(searchObj){
    try{
        let fromDate = searchObj.fromDate
        let toDate = searchObj.toDate
        let accountId = searchObj.accountId

        const from = new Date(fromDate.toString())
        from.setHours(0,0,0)
        const to = new Date(toDate.toString())
        to.setHours(23,59,59)

        let cond = { $and:[{accountId: accountId}, {createdAt:{$gte:from}}, {createdAt:{$lte:to}}]}
        transList = await TxnModel.find(cond)
        if(!transList){
            return {status: -1, err:'Cound not find any transactions', transList:[]} 
        }
        return {status:0, err:'', transList: transList}

    }catch(err){
        return {status: -1, err:err.toString(), transList:[]}
    }
}