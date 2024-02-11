const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");

const verifyUserEmail = async ({ email, otp }) => {
    try {
        const validOTP = await verifyOTP({ email, otp });
        if (!validOTP) {
            throw Error("Se ha introducido un código no válido. Compruebe su bandeja de entrada.");
        }
        // now update user record to show verified.
        await User.updateOne({ email }, { verified: true });

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

const sendVerificationOTPEmail = async (email) => {
    try {
        // check if an account exits
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("No hay cuenta para el correo electrónico proporcionado.");
        }

        const otpDetails = {
            email,
            subject: "Verificación del correo electrónico",
            message: "Por favor, introduzca el siguiente código para validar su correo electrónico:",
            duration: 1
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendVerificationOTPEmail, verifyUserEmail };