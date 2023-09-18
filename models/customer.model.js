const mongoose = require("mongoose");
const userModel = require("./user.model");

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
        enum: ['pending', 'retainer', 'active', 'suspended'],
        default: 'pending'
    },
    datecreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

customerSchema.post('findOneAndUpdate', async function (updatedCustomer) {
    try {
        // Assuming `updatedCustomer` contains the updated document
        console.log(updatedCustomer);

        // Assuming `customer_id` is a unique identifier for customers
        let updatedCustomerId = '';
        updatedCustomerId = updatedCustomer.customer_id;
        console.log(updatedCustomerId);

        // Find the corresponding user document using `customer_id`
        let user = await userModel.findOne({ user_id: updatedCustomerId})

        if (user) {
            // Update user fields with corresponding customer data
            user.fullname = updatedCustomer.fullname;
            user.email = updatedCustomer.email;
            user.contact = updatedCustomer.contact;

            // Assuming `customerStatus` can be directly mapped to `userStatus`
            if (updatedCustomer.customerStatus !== 'retainer') {
                user.userStatus = updatedCustomer.customerStatus;
            }

            // Save the updated user document
            await user.save();
        }
    } catch (error) {
        console.error('Error updating user document:', error);
    }
});

const customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;