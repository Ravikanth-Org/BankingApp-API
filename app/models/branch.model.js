const mongoose = require('mongoose');

const BranchSchema = mongoose.Schema({
    branchname: String
});

module.exports = mongoose.model('Branch', BranchSchema);