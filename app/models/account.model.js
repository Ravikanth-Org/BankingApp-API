const mongoose = require('mongoose');


const AccountSchema = mongoose.Schema({
    accountid: Number,
    type: String,
    joint: Boolean,
    primaryowner: Number,
    secondaryowner: Number,
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
