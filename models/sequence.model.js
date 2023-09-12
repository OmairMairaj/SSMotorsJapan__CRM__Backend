const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema({
    _id: String, // This will be the name of the sequence (e.g., 'userId')
    value: Number // The current value of the sequence
  });

module.exports = mongoose.model("Sequence", sequenceSchema);
