const moment = require("moment");
const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");
const { hashData } = require("./../../utils/hashData");

const resetUserPassword = async ({ email, otp, newPassword }) => {
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw Error("El usuario no existe.");
        }

        if (!existingUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        const validOTP = await verifyOTP({ email, otp });

        if (!validOTP) {
            throw Error("El código no coincide con nuestros registros. Verifique su bandeja de entrada.");
        }

        // Verificar si la contraseña ya ha sido utilizada anteriormente
        if (existingUser.previousPasswords.includes(newPassword)) {
            throw Error("Esa contraseña ha sido utilizada anteriormente.");
        }

        // Ahora actualizamos el registro del usuario con la nueva contraseña
        const hashedNewPassword = await hashData(newPassword);
        // Actualizamos la contraseña y agregamos la nueva contraseña al array de contraseñas previas
        await User.updateOne(
            { email },
            {
                password: hashedNewPassword,
                accountStatus: "activo",
                isLogginIntented: 0,
                $push: { previousPasswords: newPassword }
            }
        );

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