const mongoose = require("mongoose");
const customerModel = require("./customer.model");

const userSchema = new mongoose.Schema({
    user_id: {
        unique: true,
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    confCode: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        // enum: ["admin", "sale", "client"],
        default: "client"
    },
    userStatus: {
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
})


// Define a middleware function to update customer fields when specific user fields change
userSchema.post('findOneAndUpdate', async function (updatedUser) {
    // Check if the updated user's role is 'client'
    // console.log("updatedUser", updatedUser);
    if (updatedUser.role === 'client') {
        try {
            // Fetch the corresponding customer document based on user_id
            const customer = await customerModel.findOne({ customer_id: updatedUser.user_id });

            if (customer) {
                // Update the customer document fields that need to be synced with the user
                customer.fullname = updatedUser.fullname;
                customer.email = updatedUser.email;
                customer.contact = updatedUser.contact;

                // if (updatedUser.userStatus !== 'pending') {
                    customer.customerStatus = updatedUser.userStatus; // Update customer status
                // } 

                // Save the updated customer document
                await customer.save();
            }
        } catch (error) {
            console.error('Error updating customer document:', error);
        }
    }
});

// Create the userModel using the schema
const userModel = mongoose.model('user', userSchema);

// Export the userModel
module.exports = userModel;