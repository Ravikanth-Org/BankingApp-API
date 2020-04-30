const mongoose = require('mongoose');


const AccountSchema = mongoose.Schema({
    accountid: Number,
    type: String,
    owner: mongoose.Types.ObjectId,
    branch: String,
    balance: mongoose.Types.Decimal128,
    currency: String,
    createdDate: Date,
    lastTransDate: Date,
    cheques: [{
        chqNumber: Number
    }]
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Account', AccountSchema);
