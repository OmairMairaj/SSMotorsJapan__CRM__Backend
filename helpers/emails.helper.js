const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: process.env.SYSTEM_EMAIL_HOST,
    port: process.env.SYSTEM_EMAIL_PORT,
    secure: true,
    tls: { rejectUnauthorized: false },
    auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_EMAIL_PASSWORD
    }
});

function sendUserRegistrationEmail({ name, email, confirmationCode }, callback) {
    var mailOptions = {
        from: '"SSMotors Japan" <' + process.env.SYSTEM_EMAIL + '>',
        to: email,
        subject: 'SSMotors Japan - Verify your account',
        html: '<body><h3>Hello ' + name + '</h3><p> Thank you for registering with us.</p><p> Lets get started. Please verify your account by following this link :</p><br /><a href="' + process.env.REACT_APP_FRONTEND_URL + '/verify?code=' + confirmationCode + '">Verify Account</a><br /><br /><p>Regards,</p><p>Team SSMotors Japan</p></body>'
    }

    transport.sendMail(mailOptions, (mailErr, mailInfo) => {
        return callback(mailErr, mailInfo)
    })
}

function sendResetPasswordRequest({name, email, confirmationCode}, callback){

    var mailOptions = {
        from: '"SSMotors Japan" <' + process.env.SYSTEM_EMAIL + '>',
        to: email,
        subject: 'SSMotors Japan - Reset Your Password',
        html: '<body><h3>Hello ' + name + '</h3><br /><p>You recently requested to change your password for your account "'+ email +'" on SSMotors Japan.</p><br /><p> Lets get started. Please reset your password by following this link :</p><br /><br /><a href="' + process.env.REACT_APP_FRONTEND_URL + '/reset-password?code=' + confirmationCode + '">Reset Password Here</a><br /><br /><p>Regards,</p><p>Team SSMotors Japan</p></body>'
    }

    transport.sendMail(mailOptions, (mailErr, mailInfo) => {
        return callback(mailErr, mailInfo)
    })

}

function sendResetPasswordConfirmation(name, email){}

module.exports = {
    sendUserRegistrationEmail: sendUserRegistrationEmail,
    sendResetPasswordRequest: sendResetPasswordRequest
}