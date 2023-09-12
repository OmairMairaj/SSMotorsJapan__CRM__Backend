const validator = require('validator')
const isEmpty = require('is-empty')

const validateRegisterInput = (req, res, next) => {
    let errors = []

    // Convert fields into empty string initially if missing data
    req.body.fullname = !isEmpty(req.body.fullname) ? req.body.fullname : ''
    req.body.email = !isEmpty(req.body.email) ? req.body.email : ''
    req.body.password = !isEmpty(req.body.password) ? req.body.password : ''
    req.body.password2 = !isEmpty(req.body.password2) ? req.body.password2 : ''


    // fullname Check
    if (validator.isEmpty(req.body.fullname)) {
        errors.push("Full name is required")
    }

    // Email Check
    if (validator.isEmpty(req.body.email)) {
        errors.push("Email field is required")
    } else if (!validator.isEmail(req.body.email)) {
        errors.push('Email is invalid')
    }

    // Contact Check
    // if (!validator.isEmpty(req.body.contact)) {
    //     if (!validator.isMobilePhone(req.body.contact, 'en-PK')) {
    //         errors.push('Contact number is invalid')
    //     }
    // }

    // Password Check
    if (validator.isEmpty(req.body.password)) {
        errors.push("Password field is required")
    }

    if (validator.isEmpty(req.body.password2)) {
        errors.push("Confirm password field is required")
    }

    if (!validator.equals(req.body.password, req.body.password2)) {
        errors.push("Passwords must match")
    }

    if (!isEmpty(errors)) {
        return res.status(200).json({
            error: true,
            message: errors
        })
    } else {
        next()
    }

}

const validateLoginInput = (req, res, next) => {
    let errors = []

    // Convert fields into empty string initially if missing data
    req.body.email = !isEmpty(req.body.email) ? req.body.email : ''
    req.body.password = !isEmpty(req.body.password) ? req.body.password : ''


    // Email Check
    if (validator.isEmpty(req.body.email)) {
        errors.push("Email field is required")
    } else if (!validator.isEmail(req.body.email)) {
        errors.push('Email is invalid')
    }

    // Password Check
    if (validator.isEmpty(req.body.password)) {
        errors.push("Password field is required")
    }

    if (!isEmpty(errors)) {
        return res.status(200).json({
            error: true,
            message: errors
        })
    } else {
        next()
    }

}

validateResetPasswordInput = (req, res, next) => {
    let errors = []

    // Convert fields into empty string initially if missing data
    req.body.oldPassword = !isEmpty(req.body.oldPassword) ? req.body.oldPassword : ''
    req.body.newPass1 = !isEmpty(req.body.newPass1) ? req.body.newPass1 : ''
    req.body.newPass2 = !isEmpty(req.body.newPass2) ? req.body.password2 : ''

    // Old Password Check
    if (validator.isEmpty(req.body.oldPassword)) {
        errors.push("Old password is required")
    }

    // New Password 1 Check
    if (validator.isEmpty(req.body.newPass1)) {
        errors.push("New password is required")
    }

    // New Password 2 Check
    if (validator.isEmpty(req.body.newPass2)) {
        errors.push("Confirm password field is required")
    }

    // New Passwords Match Check
    if (!validator.equals(req.body.newPass1, req.body.newPass2)) {
        errors.push("New passwords must match")
    }

    if (!isEmpty(errors)) {
        return res.status(200).json({
            error: true,
            message: errors
        })
    } else {
        next()
    }

}

const validateUpdateUserInput = (req, res, next) => {
    let errors = []

    // Convert fields into empty string initially if missing data
    req.body.fullname = !isEmpty(req.body.fullname) ? req.body.fullname : ''
    req.body.email = !isEmpty(req.body.email) ? req.body.email : ''


    // fullname Check
    if (validator.isEmpty(req.body.fullname)) {
        errors.push("Full name is required")
    }

    // Email Check
    if (validator.isEmpty(req.body.email)) {
        errors.push("Email field is required")
    } else if (!validator.isEmail(req.body.email)) {
        errors.push('Email is invalid')
    }

    // Contact Check
    // if (!validator.isEmpty(req.body.contact)) {
    //     if (!validator.isMobilePhone(req.body.contact, 'en-PK')) {
    //         errors.push('Contact number is invalid')
    //     }
    // }

    if (!isEmpty(errors)) {
        return res.status(200).json({
            error: true,
            message: errors
        })
    } else {
        next()
    }

}



module.exports = {
    validateRegisterInput: validateRegisterInput,
    validateLoginInput: validateLoginInput,
    validateResetPasswordInput: validateResetPasswordInput,
    validateUpdateUserInput: validateUpdateUserInput
}