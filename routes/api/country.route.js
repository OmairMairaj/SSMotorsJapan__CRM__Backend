const router = require('express').Router();
const mongoose = require('mongoose');
const countryModel = require('../../models/country.model');

// Create a new country with cities
router.post('/create-country', async (req, res) => {
    try {
        const { name, cities } = req.body;

        if (!name || !cities || cities.length === 0) {
            return res.status(400).json({ message: 'Country name and at least one city are required' });
        }

        // Check for duplicate country names
        const existingCountry = await countryModel.findOne({ name });
        if (existingCountry) {
            return res.status(400).json({ message: 'Country with the same name already exists' });
        }

        // Check for duplicate city names within the same country
        const cityNames = cities.map(city => city.name);
        if (new Set(cityNames).size !== cityNames.length) {
            return res.status(400).json({ message: 'Duplicate city names are not allowed' });
        }

        const newCountry = new countryModel({
            name,
            cities
        });

        await newCountry.save();
        res.status(201).json({ message: 'Country created successfully', data: newCountry });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Check if country exists
router.get('/check/:countryName', async (req, res) => {
    try {
        const countryName = req.params.countryName;
        const existingCountry = await countryModel.findOne({ name: countryName });

        if (existingCountry) {
            return res.json({ data: existingCountry });
        }

        res.json({ data: null });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Fetch the list of all countries and cities
router.get('/getAll', async (req, res) => {
    try {
        const countries = await countryModel.find({}, 'name cities').sort({ name: 1 });
        res.json({ data: countries });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/update-country/:countryId', async (req, res) => {
    try {
        const countryId = req.params.countryId;
        const { name, cities } = req.body;

        // Check if country exists
        const existingCountry = await countryModel.findById(countryId);
        if (!existingCountry) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Validate the input data
        if (!name && !cities) {
            return res.status(400).json({ message: 'At least one field to update is required' });
        }

        // Check for duplicate country name
        if (name && name !== existingCountry.name) {
            const duplicateCountry = await countryModel.findOne({ name });
            if (duplicateCountry) {
                return res.status(400).json({ message: 'Country with the same name already exists' });
            }
        }

        // Update the fields
        existingCountry.name = name || existingCountry.name;

        if (cities) {
            existingCountry.cities = cities;
        }

        await existingCountry.save();
        res.json({ message: 'Country updated successfully', data: existingCountry });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Delete a country and its cities
router.post('/deleteCountry/:countryId', async (req, res) => {
    try {
        const countryId = req.params.countryId;
        const deletedCountry = await countryModel.findByIdAndDelete(countryId);

        if (!deletedCountry) {
            return res.status(404).json({ message: 'Country not found' });
        }

        res.json({ message: 'Country and its cities deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/add-city/:countryId', async (req, res) => {
    try {
        const { countryId } = req.params;
        const { name } = req.body;

        // Find the country by ID
        const country = await countryModel.findById(countryId);

        // Check if the country exists
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Check if the city already exists in the country
        const existingCity = country.cities.find(city => city.name === name);
        if (existingCity) {
            return res.status(400).json({ message: 'City already exists in the country' });
        }

        // Create a new city object
        const newCity = {
            _id: new mongoose.Types.ObjectId(), // Generate a new unique ID
            name: name
        };

        // Add the new city to the country's cities array
        country.cities.push(newCity);

        // Save the updated country
        await country.save();

        res.json({ message: 'City added successfully', data: newCity });
    } catch (error) {
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/delete-city/:countryId/:cityId', async (req, res) => {
    try {
        const { countryId, cityId } = req.params;

        // Find the country by ID
        const country = await countryModel.findById(countryId);

        // Check if the country exists
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Find the index of the city with the given ID
        const cityIndex = country.cities.findIndex(city => city._id.toString() === cityId);

        // Check if the city exists in the country
        if (cityIndex === -1) {
            return res.status(404).json({ message: 'City not found in the country' });
        }

        // Remove the city from the country's cities array
        country.cities.splice(cityIndex, 1);

        // Save the updated country
        await country.save();

        res.json({ message: 'City deleted successfully' });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;