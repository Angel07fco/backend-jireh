const OTP = require("./model");
const generateOTP = require("./../../utils/generateOTP");
const sendEmail = require("./../../utils/sendEmail");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const { AUTH_EMAIL } = process.env;

const verifyOTP = async ({ email, otp }) => {
    try {
        if (!(email && otp)) {
            throw Error("Proporcione valores para email, otp");
        }

        // ensure otp record exits
        const matchedOTPRecord = await OTP.findOne({ email });

        if (!matchedOTPRecord) {
            throw Error("No se han encontrado registros de otp.");
        }

        const { expiresAt } = matchedOTPRecord;

        // checking for expired code
        if (expiresAt < Date.now()) {
            await OTP.deleteOne({ email });
            throw Error("El código ha caducado. Solicite uno nuevo.");
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
            throw Error("Proporcionar valores para email, asunto, mensaje");
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
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Send code email</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" rel="stylesheet">
            </head>
            <body style="font-family: 'Roboto', sans-serif; background-color: #f6f6f6; max-width: 50%; margin: 0 auto;">
                <nav style="background-color: #00263e; padding: 1rem;">
                    <h1 style="color: #b9d5de; font-weight: bold; font-size: 1.5rem; text-align: center;">¡Hola JIREH Community!</h1>
                </nav>
                <header style="background-color: #fff; padding: 1.25rem;">
                    <p style="margin-bottom: 1rem;">Está recibiendo este correo electrónico porque se ha solicitado un código de un solo uso que puede utilizarse para la autenticación.</p>
                    <p style="font-weight: bold; margin-top: 1rem;">${message}</p>
                    <div style="text-align: center; margin-top: 1.25rem;">
                        <p style="font-weight: bold; color: #00263e; font-size: 2rem;">${generatedOTP}</p>
                        <p style="font-weight: bold; color: #00263e; margin-top: 1.25rem;">¡Este código expira en ${duration} hora!</p>
                    </div>
                    <p style="margin-top: 1.25rem;">Si no ha solicitado este correo electrónico haga caso omiso o de lo contrario utilice el chat de la interfaz de usuario o acceda a la sección de Contacto del <a href="https://veterinaria-jireh.vercel.app/" style="color: #00263e; font-weight: bold; text-decoration: underline;">sitio oficial de Jireh</a> para ponerse en contacto con nosotros.</p>
                </header>
                <footer style="background-color: #00263e; text-align: center; padding: 0.75rem;">
                    <em style="color: #b9d5de;">Este mensaje ha sido enviado desde JIreh</em>
                </footer>
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