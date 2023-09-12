const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bankAccountModel = require('../../models/bankAccount.model');
const sequence = require('../../helpers/id.helper');


//Get All Bank Account Records
router.get('/getAll', async (req, res) => {
  try {
    const bankAccounts = await bankAccountModel.find({}).sort({ position: 1 });
    res.json({ data: bankAccounts });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Create Bank Account Record
router.post('/add-account', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("A")
    const seq = await sequence.initializeSequence('bank_order_seq');
    console.log("B")
    const position = seq;
    console.log(position)
    const { bankName, branchName, accountName, accountNumber, swiftCode, branchAddress } = req.body;

    if (!bankName || !branchName || !accountName || !accountNumber || !swiftCode || !branchAddress) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate account number
    const existingAccount = await bankAccountModel.findOne({ accountNumber, bankName });
    if (existingAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Account with the same account number already exists' });
    }

    const newBankAccount = new bankAccountModel({
      bankName,
      branchName,
      accountName,
      accountNumber,
      swiftCode,
      branchAddress,
      position
    });

    await newBankAccount.save();

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: 'Bank account created successfully', data: newBankAccount });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/update-account/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const { bankName, branchName, accountName, swiftCode, branchAddress } = req.body;

    // Check if account exists
    const existingAccount = await bankAccountModel.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    // Validate the input data
    if (!bankName && !branchName && !accountName && !swiftCode && !branchAddress) {
      return res.status(400).json({ message: 'At least one field to update is required' });
    }

    // Update the fields
    existingAccount.bankName = bankName || existingAccount.bankName;
    existingAccount.branchName = branchName || existingAccount.branchName;
    existingAccount.accountName = accountName || existingAccount.accountName;
    existingAccount.swiftCode = swiftCode || existingAccount.swiftCode;
    existingAccount.branchAddress = branchAddress || existingAccount.branchAddress;

    await existingAccount.save();
    res.json({ message: 'Bank account updated successfully', data: existingAccount });
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
      await bankAccountModel.findByIdAndUpdate(
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



//Delete Bank Account Record
router.post('/delete-account/:accountId', async (req, res) => {
  try {
    const accountId = req.params.accountId;

    // Check if account exists
    const existingAccount = await bankAccountModel.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    const deletedAccount = await bankAccountModel.findByIdAndDelete(accountId);

    res.json({ message: 'Bank account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;