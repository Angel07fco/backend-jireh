const moment = require("moment");
const User = require("./../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const bcrypt = require("bcrypt");

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

       // Verificar si la nueva contraseña ya ha sido utilizada anteriormente
        const isNewPasswordUsed = existingUser.previousPasswords.some((encryptedPassword) =>
            bcrypt.compareSync(newPassword, encryptedPassword)
        );

        if (isNewPasswordUsed) {
            throw Error("Esa contraseña ha sido utilizada anteriormente.");
        }

        // Encriptar la nueva contraseña
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

const resetUserPasswordByReply = async ({ email, reply_secret, newPassword }) => {
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw Error("El usuario no existe.");
        }

        if (!existingUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        const hashedReply = existingUser.reply_secret;
        const replyMatch = await verifyHashedData(reply_secret, hashedReply);

        if (!replyMatch) {
            throw Error("La respuesta no coincide con la ingreso en el registro.");
        }

       // Verificar si la nueva contraseña ya ha sido utilizada anteriormente
        const isNewPasswordUsed = existingUser.previousPasswords.some((encryptedPassword) =>
            bcrypt.compareSync(newPassword, encryptedPassword)
        );

        if (isNewPasswordUsed) {
            throw Error("Esa contraseña ha sido utilizada anteriormente.");
        }

        // Encriptar la nueva contraseña
        const hashedNewPassword = await hashData(newPassword);

        await User.updateOne(
            { email },
            {
                password: hashedNewPassword,
                accountStatus: "activo",
                isLogginIntented: 0,
                $push: { previousPasswords: hashedNewPassword }
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

const sendPasswordResetUser = async (email) => {
    try {
        // check if an account exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("No hay ninguna cuenta para el correo electrónico proporcionado.")
        }

        if (!existingUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        const userInfo = {
            user: existingUser.user,
            email: email,
            question_secret: existingUser.question_secret,
            reply_secret: existingUser.reply_secret
        };

        return userInfo;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendPasswordResetOTPEmail, resetUserPasswordByReply, resetUserPassword, sendPasswordResetUser };