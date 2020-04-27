const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
    accountName: String,
    accountNumber: Number,
    openingDate: Date,
    accountBalance: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);