const OTP = require("./model");
const generateOTP = require("./../../utils/generateOTP");
const sendEmail = require("./../../utils/sendEmail");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
    try {
        if (!(email && otp)) {
            throw Error("Provide values for email, otp");
        }

        // ensure otp record exits
        const matchedOTPRecord = await OTP.findOne({ email });

        if (!matchedOTPRecord) {
            throw Error("No otp records found.");
        }

        const { expiresAt } = matchedOTPRecord;

        // checking for expired code
        if (expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            throw Error("Code has expired. Request for a new one.");
        }

        // not expired yet, verify value
        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
    } catch (error) {
        throw error;
    }
};

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
    try {
        if (!(email && subject && message)) {
            throw Error("Provide values for email, subject, message");
        }

        // clear any old record
        await OTP.deleteOne({ email });

        // generate pin
        const generatedOTP = await generateOTP();

        // send email
        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Envio de correo Electronico con NodeJS</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link
                    href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&display=swap"
                    rel="stylesheet" />
                    <style>
                    html {
                        height: 100%;
                    }
                    body {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        font-family: "Instrument Sans", sans-serif;
                    }
                    .content {
                        top: 0;
                        margin: 0 auto;
                        width: 90%;
                        height: 100vh;
                        background-color: #f2f4f8;
                    }
                    .logo {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        margin: 10px;
                        width: 150px;
                        margin-right: 50px;
                    }
                    h1 {
                        color: #22b5a0;
                        padding: 30px 5px;
                    }
                    h3 {
                        text-align: center;
                    }
                    section {
                        padding: 5px 50px;
                    }
                    p {
                        text-align: justify;
                        color: #666 !important;
                    }
                    hr {
                        border: 1px solid #eee;
                    }
                    </style>
                </head>
                <body>
                    <div class="content">
                    <h1 style="text-align: center">
                        ¡Hola JIREH Community!
                        <hr />
                        <p>${message}</p>
                    </h1>
                    <section>
                        <h3>
                        Este correo electrónico es una prueba enviada utilizando Node.js.
                        </h3>
                        <p>
                        ${generatedOTP}
                        </p>
                        <br />
                        <h3>¡This code expires in ${duration}!</h3>
                    </section>
                    <a href="https://urianviera.com/">
                        <img
                        class="logo"
                        src="https://urianviera.com/assets/imgs/logo.png"
                        alt="Urian-Viera Logo" />
                    </a>
                    </div>
                </body>
            </html>`
        };
        await sendEmail(mailOptions);

        // save otp record
        const hashedOTP = await hashData(generatedOTP);
        const newOTP = await new OTP({
            email,
            otp: hashedOTP,
            createAt: Date.now(),
            expiresAt: Date.now() + 3600000 * +duration,
        });

        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord;
    } catch (error) {
        throw error;
    }
};

const deleteOTP = async (email) => {
    try {
        await OTP.deleteOne({ email });
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTP, verifyOTP, deleteOTP };