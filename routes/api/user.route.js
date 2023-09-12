const router = require('express').Router();
const authHelpers = require('../../helpers/auth.helper');
const validationHelpers = require('../../helpers/validation.helper');
const emailHelpers = require('../../helpers/emails.helper');
const userModel = require('../../models/user.model');
const sequence = require('../../helpers/id.helper');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const isEmpty = require('is-empty')
// const validator = require('validator')

// register user - body: fullname, email, password, password2
router.post('/register', validationHelpers.validateRegisterInput, async (req, res) => {
    const seq = await sequence.getNextSequence('user_id');
    const userId = 'SSM-'+ seq.toString().padStart(5, '0');
    let newUser = new userModel({
        user_id: userId,
        fullname: req.body.fullname,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        confCode: authHelpers.genConfCode(),
        role: req.body.role
    })

    try {
        // Hash password before saving in database
        newUser.password = await bcrypt.hash(newUser.password, 10)
        await newUser.save()
        // Send confirmation email
        emailHelpers.sendUserRegistrationEmail({ name: newUser.fullname, email: newUser.email, confirmationCode: newUser.confCode }, (err, info) => {
            if (err) {
                // console.log(err)
                return res.status(200).json({
                    error: true,
                    message: 'User registered successfully. But verification email could not be sent.'
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: 'User registered successfully'
                })
            }
        })
    } catch (err) {

        if (err.code === 11000) {
            return res.status(200).json({
                error: true,
                message: 'Email already exists'
            })
        }

        return res.status(200).json({
            error: true,
            message: err.message
        })
    }
})

// verify email
router.get('/verify/:confCode', async (req, res) => {
    try {
        let verifyUser = await userModel.updateOne({ confCode: req.params.confCode, userStatus: 'pending' }, { userStatus: 'active', confCode: authHelpers.genConfCode() })

        if (verifyUser.modifiedCount < 0) {
            return res.status(200).json({
                error: true,
                message: 'User not found or is already verified.'
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'User verified successfully.'
            })
        }
    } catch (err) {
        return res.status(200).json({
            error: true,
            message: err.message
        })
    }
})

// login user
router.post('/login', validationHelpers.validateLoginInput, async (req, res) => {
    try {
        let thisUser = await userModel.findOne({ email: req.body.email })

        // return if user not found or is not verified
        if (isEmpty(thisUser)) {
            return res.status(200).json({
                error: true,
                message: 'User not found.'
            })
        } else if (thisUser.userStatus === 'pending') {
            return res.status(200).json({
                error: true,
                message: 'User not verified. Please check your email.'
            })
        } else if(thisUser.userStatus === 'suspended'){
            return res.status(200).json({
                error: true,
                message: 'User is suspended. Please contact the administrator.'
            })
        }


        let passwordMatch = await bcrypt.compare(req.body.password, thisUser.password)
        // return if incorrect password
        if (!passwordMatch) {
            return res.status(200).json({
                error: true,
                message: 'Incorrect password.'
            })
        }

        // generate token
        await authHelpers.signToken({ id: thisUser._id, email: thisUser.email, fullname: thisUser.fullname, password: thisUser.password, datecreated: thisUser.datecreated }, process.env.ENCRYPTION_SECRET_USER, { expiresIn: 86400 })
            .then(token => {
                return res.status(200).cookie('auth_token', token, { httpOnly: false, secure: process.env.NODE_ENV == 'production', maxAge: 86400000, sameSite: "none" }).json({
                    error: false,
                    message: 'User logged in successfully.',
                    user: {
                        userId: thisUser._id,
                        fullname: thisUser.fullname,
                        email: thisUser.email,
                        role: thisUser.role,
                        userStatus: thisUser.userStatus,
                        datecreated: thisUser.datecreated
                    }
                })
            })
            .catch(err => {
                // console.log(err)
                return res.status(200).json({
                    error: true,
                    message: 'Sign in failed. Please try again later.'
                })
            })
    } catch (err) {
        return res.status(200).json({
            error: true,
            message: err.message
        })
    }
})


// logout user
router.post('/logout', async (req, res) => {
    return res.status(200).cookie('auth_token', null, { httpOnly: false, secure: process.env.NODE_ENV == 'production', maxAge: 10, sameSite: "none" }).json({
        message: 'Logout successful!'
    })
})

// reset password logged in - body: oldPassword, newPass1, newPass2
// router.post('/reset-password', authHelpers.verifyUserTokenMiddleware,  async (req, res) => {

//     let errors = []

//     Old Password Check
//     if (validator.isEmpty(req.body.oldPassword)) {
//         errors.push("Old password is required")
//     }

//     New Password 1 Check
//     if (validator.isEmpty(req.body.newPass1)) {
//         errors.push("New password is required")
//     }

//     New Password 2 Check
//     if (validator.isEmpty(req.body.newPass2)) {
//         errors.push("Confirm password field is required")
//     }

//     New Passwords Match Check
//     if (!validator.equals(req.body.newPass1, req.body.newPass2)) {
//         errors.push("New passwords must match")
//     }

//     if(!isEmpty(errors)){
//         return res.status(200).json({
//             error: true,
//             message: errors
//         })
//     }


//     try{

//         let isMatch = await bcrypt.compare(req.body.oldPassword, req.body.decodedUser.password)
//         if(!isMatch){
//             return res.status(200).json({
//                 error: true,
//                 message: 'Incorrect old password.'
//             })
//         }

//         let updated = await userModel.updateOne({email: req.body.decodedUser.email}, {password: await bcrypt.hash(req.body.newPass1, 10), confCode: authHelpers.genConfCode()})

//         if(updated.modifiedCount < 0){
//             return res.status(200).json({
//                 error: true,
//                 message: 'Password reset failed. Please try again later.'
//             })
//         } else {
//             return res.status(200).json({
//                 error: false,
//                 message: 'Password reset successfully.'
//             })
//         }
//     } catch(err){
//         return res.status(200).json({
//             error: true,
//             message: err.message
//         })
//     }
// })

// request reset password - body: email
router.post('/request-reset-password', async (req, res) => {

    try {
        let thisUser = await userModel.findOne({ email: req.body.email })

        // return if user not found
        if (isEmpty(thisUser)) {
            return res.status(200).json({
                error: true,
                message: 'User not found.'
            })
        }

        // send password reset email here
        emailHelpers.sendResetPasswordRequest({ name: thisUser.fullname, email: thisUser.email, confirmationCode: thisUser.confCode }, (mailErr, mailInfo) => {
            if (mailErr) {
                // console.log(mailErr)
                return res.status(200).json({
                    error: true,
                    message: 'Password reset email failed to send.'
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: 'Password reset email sent successfully.'
                })
            }
        })
    } catch (err) {
        return res.status(200).json({
            error: true,
            message: err.message
        })
    }
})

// reset password check conf code
// router.get('/reset-password/check-validity:confCode', async (req, res) => {
//     try{
//         let thisUser = await userModel.findOne({confCode: req.params.confCode})

//         // return if user not found
//         if(isEmpty(thisUser)){
//             return res.status(200).json({
//                 error: true,
//                 message: 'User not found.'
//             })
//         }

//         if(thisUser.userStatus === 'pending'){
//             return res.status(200).json({
//                 error: true,
//                 message: 'User not verified. Please check your email.'
//             })
//         }

//         return res.status(200).json({
//             error: false,
//             message: 'User found.',
//             data: {email: thisUser.email, fullname: thisUser.fullname}
//         })   
//     } catch(err){
//         return res.status(200).json({
//             error: true,
//             message: err.message
//         })
//     }
// })

// reset password logged out - body: newPass1, newPass2
// router.post('/reset-password/:confCode', async (req, res) => {

//     if(req.body.newPass1 != req.body.newPass2){
//         return res.status(200).json({
//             error: true,
//             message: 'New passwords do not match.'
//         })
//     }

//     try{
//         let updated = await userModel.updateOne({confCode: req.params.confCode}, {password: await bcrypt.hash(req.body.newPass1, 10), confCode: authHelpers.genConfCode()})

//         if(updated.modifiedCount < 0){
//             return res.status(200).json({
//                 error: true,
//                 message: 'Password reset failed. Please try again later.'
//             })
//         } else {
//             return res.status(200).json({
//                 error: false,
//                 message: 'Password reset successfully.'
//             })
//         }
//     } catch(err){
//         return res.status(200).json({
//             error: true,
//             message: err.message
//         })
//     }
// })


// get user info
// router.post('/user-info', authHelpers.verifyUserTokenMiddleware, async (req, res) => {
//     return res.status(200).json({
//         error: false,
//         message: 'User info retrieved successfully.',
//         userInfo: req.body.decodedUser
//     })
// })

// check user session
// router.post('/check-session', authHelpers.verifyUserTokenMiddleware, async (req, res) => {
//     return res.status(200).json({
//         error: false,
//         message: 'User session verified successfully.'
//     })
// })


// get all users
router.get('/get-users', async (req, res) => {
    try {
        const users = await userModel.find({}).sort({  role: 1, userStatus: 1, fullname: 1 });

        if (users.length === 0) {
            return res.status(200).json({
                error: false,
                message: 'No users found'
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Found Users!',
            data: users
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
})


// get user by id and update
router.post(`/updateUser/:id`, validationHelpers.validateUpdateUserInput, async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: updatedData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})


module.exports = router;
