const nodeMailer = require("nodemailer")

const sendEmail = ({ to, subject = "Email From Ecommerce App", html, text }) => {
    const tranasporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_EMAIL_PASS,
        }
    })

    tranasporter.sendMail({
        to,
        from: process.env.USER_EMAIL,
        subject,
        html,
        text
    }, err => {
        if (err) {
            console.log(err);
            return false
        } else {
            return true
        }
    })
}

module.exports = sendEmail