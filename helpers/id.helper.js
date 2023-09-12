const Sequence = require('../models/sequence.model');

const getNextSequence = async (name) => {
  const sequenceDoc = await Sequence.findByIdAndUpdate(
    name,
    { $inc: { value: (Math.random()*10).toFixed(0).toString().padStart(5, '0') } },
    { new: true, upsert: true }
  );

  return sequenceDoc.value;
}

const initializeSequence = async (name) => {
  try {
    console.log("B")
    console.log('Initializing sequence:', name);
    const sequence = await Sequence.findByIdAndUpdate(
      name, // Provide a unique name for your sequence
      { $inc: { value: 1 } },
      { upsert: true, new: true }
    );

    console.log('Sequence initialized:', sequence);
    return sequence.value;
  } catch (error) {
    console.error('Error initializing sequence:', error);
  }
}

module.exports = {
  getNextSequence: getNextSequence,
  initializeSequence: initializeSequence
}