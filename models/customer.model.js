const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customer_id: {
        unique: true,
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    altemail: {
        type: String,
    },
    contact: {
        type: String,
        required: true,
    },
    contact2: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    salesPerson: {
        type: String,
        required: true
    },
    registerAs: {
        type: String,
        required: true
    },
    prefCurrency: {
        type: String,
        required: true
    },
    customerStatus: {
        type: String,
        required: true,
        enum: ['retainer', 'active', 'suspended'],
        default: 'active'
    },
    datecreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model("customer", customerSchema);