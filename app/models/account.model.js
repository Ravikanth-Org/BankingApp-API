const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
    accountName: String,
    accountNumber: Number,
    openingDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);