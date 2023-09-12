const router = require('express').Router();
const authHelpers = require('../../helpers/auth.helper');
const validationHelpers = require('../../helpers/validation.helper');
const emailHelpers = require('../../helpers/emails.helper');
const userModel = require('../../models/user.model');
const customerModel = require('../../models/customer.model');
const sequence = require('../../helpers/id.helper');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const isEmpty = require('is-empty');
const { default: mongoose } = require('mongoose');
// const validator = require('validator')

// register user - body: fullname, email, password, password2
router.post('/signup', validationHelpers.validateRegisterInput, async (req, res) => {
    const seq = await sequence.getNextSequence('user_id');
    const userId = 'SSM-' + seq.toString().padStart(5, '0');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            fullname,
            company,
            email,
            altemail,
            contact,
            contact2,
            password,
            password2,
            address,
            country,
            city,
            salesPerson,
            registerAs,
            prefCurrency,
            sendEmail
        } = req.body;

        // Check if username or email already exists
        const existingUser = await userModel.findOne({ $or: [{ fullname }, { email }] });
        if (existingUser) {
            // User or email already exists, abort transaction
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: true, message: 'This email account already exists' });
        }

        // Create a new user account
        const newUser = new userModel({
            user_id: userId,
            fullname: fullname,
            email: email,
            contact: contact,
            password: password,
            confCode: authHelpers.genConfCode(),
            role: "client"
        });

        // Hash password before saving in the database
        newUser.password = await bcrypt.hash(newUser.password, 10);

        // Create a new customer account
        const newCustomer = new customerModel({
            customer_id: userId,
            fullname: fullname,
            company: company,
            email: email,
            altemail: altemail,
            contact: contact,
            contact2: contact2,
            address: address,
            country: country,
            city: city,
            customerStatus: "active",
            salesPerson: salesPerson,
            registerAs: registerAs,
            prefCurrency: prefCurrency
        });

        await newUser.save({ session }); // Save user within the session
        await newCustomer.save({ session }); // Save customer within the session  
        
         // Commit the transaction
         await session.commitTransaction();
         session.endSession();  

        // Send confirmation email
        if (sendEmail === true) {
            emailHelpers.sendUserRegistrationEmail({ name: newUser.fullname, email: newUser.email, confirmationCode: newUser.confCode }, (err, info) => {
                if (err) {
                    // Error sending confirmation email, still consider the signup successful
                    return res.status(200).json({
                        error: true,
                        message: 'User registered successfully, but verification email could not be sent.'
                    });
                } else {
                    // User registered successfully
                    return res.status(200).json({
                        error: false,
                        message: 'User registered successfully'
                    });
                }
            });
        } else {
            return res.status(200).json({
                error: false,
                message: 'User registered successfully'
            });
        }
       
    } catch (err) {
        // Any error during transaction, abort and roll back the changes
        await session.abortTransaction();
        session.endSession();

        if (err.code === 11000) {
            // Duplicate key error (email or username already exists)
            return res.status(400).json({
                error: true,
                message: 'Email or username already exists'
            });
        } else {
            // Other unhandled errors
            return res.status(500).json({
                error: true,
                message: err.message
            });
        }
    }
});


router.get('/get-customers', async (req, res) => {
    try {
        const customers = await customerModel.find({}).sort({ customer_id: 1 });
        // console.log(customers);
        if (customers.length === 0) {
            return res.status(200).json({
                error: false,
                message: 'No customers found',
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Found Customers!',
            data: customers
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
})



module.exports = router;
