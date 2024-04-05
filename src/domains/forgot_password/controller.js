const moment = require("moment");
const User = require("../user/model");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/controller");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const bcrypt = require("bcrypt");
const { createdLog } = require("../log_inicio_sesion/controller");

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

const validateUserReply = async ({email, reply_secret }) => {
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
        return;
    } catch (error) {
        throw error;
    }
};

const validateUserOTP = async ({ email, otp }) => {
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

        await deleteOTP(email);
        return;
    } catch (error) {
        throw error;
    }
};

const resetPassword = async ({ email, newPassword, ip, navegador }) => {
    try {
        const existingUser = await User.findOne({ email });

        let accion = "Cambio de contraseña";

        if (!existingUser) {
            throw Error("El usuario no existe.");
        }

        if (!existingUser.verified) {
            await createdLog({ usuario: existingUser._id, ip, navegador, tipo: "3", accion, descripcion: "Fallo al intentar cambiar la contraseña ya que la cuenta no ha sido verificada" });
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.");
        }

        // Verificar si la nueva contraseña ya ha sido utilizada anteriormente
        const isNewPasswordUsed = existingUser.previousPasswords.some((encryptedPassword) =>
            bcrypt.compareSync(newPassword, encryptedPassword)
        );

        if (isNewPasswordUsed) {
            await createdLog({ usuario: existingUser._id, ip, navegador, tipo: "3", accion, descripcion: "Fallo al intentar cambiar la contraseña ya que esa contraseña ha sido ingresada anteriormente" });
            throw Error("Esa contraseña ha sido utilizada anteriormente.");
        }

        // Encriptar la nueva contraseña
        const hashedNewPassword = await hashData(newPassword);
        await createdLog({ usuario: existingUser._id, ip, navegador, tipo: "3", accion, descripcion: "Hubo un cambio de contraseña correctamente" });

        // Actualizamos la contraseña y agregamos la nueva contraseña al array de contraseñas previas
        await User.updateOne(
            { email },
            {
                password: hashedNewPassword,
                accountStatus: "activo",
                isLogginIntented: 0,
                $push: { previousPasswords: hashedNewPassword }
            }
        );

        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendPasswordResetOTPEmail,
    sendPasswordResetUser,
    validateUserReply,
    validateUserOTP,
    resetPassword,
};