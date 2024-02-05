const nodemailer = require("nodemailer");

const { AUTH_EMAIL, AUTH_PASS } = process.env;

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASS,
    },
});

const sendEmail = async (mailOptions) => {
    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Correo electrónico enviado: " + info.response);
            }
        });
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;