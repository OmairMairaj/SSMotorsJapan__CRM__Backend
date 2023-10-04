const mongoose = require('mongoose');
const BankAccount = require('./bankAccount.model');

// Define the Vehicle schema
const vehicleSchema = new mongoose.Schema({
    vehicleName: {
        type: String,
        required: true
    },
    chassisNo: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    mileage: {
        type: String,
        required: true
    },
    steering: {
        type: String,
        required: true
    },
    mfg: {
        type: String,
        required: true
    },
    fuel: {
        type: String,
        required: true
    },
    engine: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    // Add other vehicle details properties here
});

// Define the Invoice schema with a nested array of vehicles
const invoiceSchema = new mongoose.Schema({
    invoice_id: {
        type: String,
        required: true,
        unique: true
    },
    agentName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    hasConsignee: {
        type: Boolean,
        required: true
    },
    consignee: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bankAccount: {
        type: BankAccount.schema, // Embed the BankAccount schema
        required: true
    },
    paymentTerm: {
        type: String,
        required: true
    },
    tradeTerm: {
        type: String,
        required: true
    },
    loadingPort: {
        type: String,
        required: true
    },
    dischargingPort: {
        type: String,
        required: true
    },
    vehicles: {
        type: [vehicleSchema], 
        required: true
    },
});

// Create models for Invoice and Vehicle
const Invoice = mongoose.model('invoice', invoiceSchema);
const Vehicle = mongoose.model('vehicle', vehicleSchema);

module.exports = {
    Invoice,
    Vehicle,
};
