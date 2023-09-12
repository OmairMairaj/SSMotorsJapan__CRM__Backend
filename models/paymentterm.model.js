const mongoose = require('mongoose');

const paymentTermSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  percentage: {
    type: String,
    required: true,
    min: 0,
    max: 100
  },
  position: {
    type: Number,
    required: true,
  }
});

const PaymentTerm = mongoose.model('PaymentTerm', paymentTermSchema);

module.exports = PaymentTerm;