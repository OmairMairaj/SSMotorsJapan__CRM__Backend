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
    const htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
    </head>
    
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f4f4">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff"
                        style="border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
                        <tr bgcolor=#153e4d>
                            <td align="center" style="padding: 40px 0;">
                            <a href="#"><img src="https://ssmotorsjapan.com/wp-content/uploads/2015/10/SSMOTORS-COLORED2-e1667568439880.png"
                                    alt="Logo" width="200" height="150" style="display: block; cursor: default"></a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 30px;">
                                <h1 style="color: #333; font-size: 24px; margin: 0;">Hello `+ name + `!</h1>
                                <p style="color: #666; font-size: 16px; margin-top: 20px;">Thank you for creating an account
                                    with us. To get started, please click the button below to verify your email address:</p>
                                <p style="color: #666; font-size: 16px; text-decoration: none;"><strong>Email:</strong> `+ email + `</p>
                                <a href="` + process.env.REACT_APP_FRONTEND_URL + `/verify?code=` + confirmationCode + `"
                                    style="display: inline-block; background-color: #153e4d; color: #ffffff; font-size: 18px; text-decoration: none; padding: 10px 20px; margin-top: 20px; border-radius: 5px; transition: background-color 0.3s;">Verify
                                    Email</a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <p style="color: #999; font-size: 14px; margin: 0;">If you did not create an account on
                                    SSMotorsJapan, please ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    
    </body>
    
    </html>
    </body>
    
    </html>`;


    var mailOptions = {
        from: '"SSMotors Japan" <' + process.env.SYSTEM_EMAIL + '>',
        to: email,
        subject: 'SSMotors Japan - Verify your account',
        html: htmlTemplate
        // html: '<body><h3>Hello ' + name + '</h3><p> Thank you for registering with us.</p><p> Lets get started. Please verify your account by following this link :</p><br /><a href="' + process.env.REACT_APP_FRONTEND_URL + '/verify?code=' + confirmationCode + '">Verify Account</a><br /><br /><p>Regards,</p><p>Team SSMotors Japan</p></body>'
    }

    transport.sendMail(mailOptions, (mailErr, mailInfo) => {
        return callback(mailErr, mailInfo)
    })
}

function sendResetPasswordRequest({ name, email, confirmationCode }, callback) {

    const htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f4f4" style="cursor: default">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table width="600" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
                        <tr bgcolor=#153e4d>
                            <td align="center" style="padding: 40px 0;">
                            <a href="#"><img src="https://ssmotorsjapan.com/wp-content/uploads/2015/10/SSMOTORS-COLORED2-e1667568439880.png" alt="Logo" width="200" height="150" style="display: block; cursor: default"></a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 30px;">
                                <h1 style="color: #333; font-size: 24px; margin: 0;">Forgot Your Password?</h1>
                                <p style="color: #666; font-size: 16px; margin-top: 20px;">No worries! To reset your password, simply click the button below:</p>
                                <a href="` + process.env.REACT_APP_FRONTEND_URL + `/reset-password?code=` + confirmationCode + `" style="display: inline-block; background-color: #153e4d; color: #ffffff; font-size: 18px; text-decoration: none; padding: 10px 20px; margin-top: 20px; border-radius: 5px; transition: background-color 0.3s;">Reset Password</a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <p style="color: #999; font-size: 14px; margin: 0;">If you didn't request this password reset, you can safely ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`

    var mailOptions = {
        from: '"SSMotors Japan" <' + process.env.SYSTEM_EMAIL + '>',
        to: email,
        subject: 'SSMotors Japan - Reset Your Password',
        html: htmlTemplate
        // html: '<body><h3>Hello ' + name + '</h3><br /><p>You recently requested to change your password for your account "'+ email +'" on SSMotors Japan.</p><br /><p> Lets get started. Please reset your password by following this link :</p><br /><br /><a href="' + process.env.REACT_APP_FRONTEND_URL + '/reset-password?code=' + confirmationCode + '">Reset Password Here</a><br /><br /><p>Regards,</p><p>Team SSMotors Japan</p></body>'
    }

    transport.sendMail(mailOptions, (mailErr, mailInfo) => {
        return callback(mailErr, mailInfo)
    })

}

function sendResetPasswordConfirmation(name, email) { }

module.exports = {
    sendUserRegistrationEmail: sendUserRegistrationEmail,
    sendResetPasswordRequest: sendResetPasswordRequest
}