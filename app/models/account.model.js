const mongoose = require('mongoose');


const AccountSchema = mongoose.Schema({
    accountid: Number,
    type: String,
    owner: Number,
    branch: String,
    balance: Number,
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
