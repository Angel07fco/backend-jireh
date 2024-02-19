const moment = require("moment");
const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");
const { hashData } = require("./../../utils/hashData");

const resetUserPassword = async ({ email, otp, newPassword }) => {
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        const validOTP = await verifyOTP({ email, otp });

        if (!validOTP) {
            throw Error("El código no coincide con nuestros registros. Verifique su bandeja de entrada.");
        }

        //  now update user record with new password.
        if (newPassword.length < 8) {
            throw Error("Password is too short!");
        }

        const hashedNewPassword = await hashData(newPassword);
        await User.updateOne({ email }, {password:  hashedNewPassword});
        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

const sendPasswordResetOTPEmail = async (email) => {
    try {
        // check if an account exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("No hay ninguna cuenta para el correo electrónico proporcionado.")
        }

        if (!existingUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        const optDetails = {
            email,
            subject: "Restablecer contraseña",
            message: "Por favor, introduzca el siguiente código para restablecer su contraseña.",
            duration: 1,
        };
        const createdOTP = await sendOTP(optDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendPasswordResetOTPEmail, resetUserPassword };