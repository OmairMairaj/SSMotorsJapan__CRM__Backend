const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: String,
});

const countrySchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String,
    },
    cities: [citySchema] // Array of cities
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;