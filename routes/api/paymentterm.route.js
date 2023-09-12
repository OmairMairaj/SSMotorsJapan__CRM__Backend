const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const paymentTermModel = require('../../models/paymentterm.model');
const sequence = require('../../helpers/id.helper');

//Get All Payment Terms
router.get('/getAll', async (req, res) => {
  try {
    const paymentTerms = await paymentTermModel.find({}).sort({ position: 1 });
    res.json({ data: paymentTerms });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Add New Payment Term
router.post('/create-payment-term', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("A")
    const seq = await sequence.initializeSequence('term_order_seq');
    console.log("B")
    const position = seq;
    console.log(position)
    const { name, percentage } = req.body;

    if (!name || !percentage) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Name and percentage are required' });
    }

    // Check for duplicate payment term name
    const existingPaymentTerm = await paymentTermModel.findOne({ name });
    if (existingPaymentTerm) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Payment term with the same name already exists' });
    }

    const newPaymentTerm = new paymentTermModel({
      name,
      percentage,
      position
    });

    await newPaymentTerm.save();
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Payment term created successfully', data: newPaymentTerm });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/update-payment-term/:paymentTermId', async (req, res) => {
  try {
    const paymentTermId = req.params.paymentTermId;
    const { name, percentage } = req.body;

    // Check if payment term exists
    const existingPaymentTerm = await paymentTermModel.findById(paymentTermId);
    if (!existingPaymentTerm) {
      return res.status(404).json({ message: 'Payment term not found' });
    }

    // Validate the input data
    if (!name && !percentage) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Update the fields
    existingPaymentTerm.name = name || existingPaymentTerm.name;
    existingPaymentTerm.percentage = percentage || existingPaymentTerm.percentage;

    await existingPaymentTerm.save();
    res.json({ message: 'Payment term updated successfully', data: existingPaymentTerm });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/updateOrder', async (req, res) => {
  try {
    const { order } = req.body;
    // console.log(req.body);

    // Loop through the sorted order and update each item's order field in the database
    for (let i = 0; i < order.length; i++) {
      const itemId = order[i]._id;
      await paymentTermModel.findByIdAndUpdate(
        itemId,
        { $set: { 'position': i + 1 } },
        { new: true, upsert: true },
      )
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete Payment Term
router.post('/delete-payment-term/:paymentTermId', async (req, res) => {
  try {
    const paymentTermId = req.params.paymentTermId;
    const deletedPaymentTerm = await paymentTermModel.findByIdAndDelete(paymentTermId);

    if (!deletedPaymentTerm) {
      return res.status(404).json({ message: 'Payment term not found' });
    }

    res.json({ message: 'Payment term deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;