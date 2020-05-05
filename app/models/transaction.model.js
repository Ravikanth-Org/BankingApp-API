const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    transactionId: Number,
    accountId: Number,
    time: Date,
    status: String,
    transAmount: Number,
    balance: Number,
    remarks: String,
    credit: Boolean,
    transtype: String,
    fromAcct: Number,
    toAcct:Number,
    chequeNumber: Number
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Transaction', TransactionSchema);
