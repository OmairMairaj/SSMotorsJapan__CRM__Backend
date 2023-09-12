const router = require('express').Router();
const currencyModel = require('../../models/currency.model');


//Get All Currencies
router.get('/getAll', async (req, res) => {
    try {
        const currencies = await currencyModel.find({}).sort({ code: 1 });
        res.json({ data: currencies });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Add New Currency
router.post('/add-currency', async (req, res) => {
    try {
        const { name, code, symbol } = req.body;

        if (!name || !code || !symbol) {
            return res.status(400).json({ message: 'Name, code, and symbol are required' });
        }

        // Check for duplicate currency name or code
        const existingCurrency = await currencyModel.findOne({ $or: [{ name }, { code }] });
        if (existingCurrency) {
            return res.status(400).json({ message: 'Currency with the same name or code already exists' });
        }

        const newCurrency = new currencyModel({
            name,
            code,
            symbol
        });

        await newCurrency.save();
        res.status(201).json({ message: 'Currency created successfully', data: newCurrency });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/update-currency/:currencyId', async (req, res) => {
    try {
      const currencyId = req.params.currencyId;
      const { code, name, symbol } = req.body;
  
      // Check if currency exists
      const existingCurrency = await currencyModel.findById(currencyId);
      if (!existingCurrency) {
        return res.status(404).json({ message: 'Currency not found' });
      }
  
      // Validate the input data
      if (!code && !name && !symbol) {
        return res.status(400).json({ message: 'At least one field to update is required' });
      }
  
      // Update the fields
      existingCurrency.code = code || existingCurrency.code;
      existingCurrency.name = name || existingCurrency.name;
      existingCurrency.symbol = symbol || existingCurrency.symbol;
  
      await existingCurrency.save();
      res.json({ message: 'Currency updated successfully', data: existingCurrency });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

//Delete Currency
router.post('/delete-currency/:currencyId', async (req, res) => {
    try {
      const currencyId = req.params.currencyId;
      const deletedCurrency = await currencyModel.findByIdAndDelete(currencyId);
  
      if (!deletedCurrency) {
        return res.status(404).json({ message: 'Currency not found' });
      }
  
      res.json({ message: 'Currency deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;