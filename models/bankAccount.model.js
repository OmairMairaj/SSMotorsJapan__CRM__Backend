const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true
  },
  branchName: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  swiftCode: {
    type: String,
    required: true
  },
  branchAddress: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  }
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
