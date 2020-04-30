const mongoose = require('mongoose');

const TransactionSchema = Schema({
    transactionId: Number,
    accountId: mongoose.Types.ObjectId,
    time: Date,
    status: String,
    balance: mongoose.Types.Decimal128,
    remarks: String,
    credit: Boolean,
    transtype: String,
    fromAcct: mongoose.Types.ObjectId,
    toAcct:mongoose.Types.ObjectId,
    chequeNumber: Number
}, {
    timestamps: true
}
);

export default model('Transaction', TransactionSchema);