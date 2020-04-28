const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userid: Number,
    username: String,
    password: String,
    role: String,
    userDetails: {
        name: String,
        dob: Date,
        address: String,
        city: String,
        pin: Number,
        phone: Number
    }
}, {
    timestamps: true
}
);

const AccountSchema = mongoose.Schema({
    accountName: String,
    accountNumber: Number,
    openingDate: Date
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Account', AccountSchema);
module.exports = mongoose.model('Users', UserSchema);