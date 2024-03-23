const User = require("../pet/model");
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

const sendEmailAccountblocked = async (email) => {
    try {
        // check if an account exits
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("No hay cuenta para el correo electrónico proporcionado.");
        }

        const otpDetails = {
            email,
            subject: "Cuenta bloqueada temporalmente",
            message: "Su cuenta ha sido bloqueada temporalmente debido a varios intentos fallidos al iniciar sesión, por favor ingrese el siguiente código para poder restablecer su contraseña.",
            duration: 1
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

const sendEmailStatusUserAdmin = async (email) => {
    try {
        // check if an account exits
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw Error("No hay cuenta para el correo electrónico proporcionado.");
        }

        const otpDetails = {
            email: "clinicaveterinariajireh@gmail.com",
            subject: "Bloqueo de cuenta temporal",
            message: `La cuenta con el siguiente correo electrónico: ${email} ha sido bloqueada temporalmente debido a varios intentos fallido al iniciar sesión. Pongase en contacto con el usuario y ofrecer las diferentes formas que tiene para recuperar su desbloquear su cuenta o en cu caso dar de baja.`,
            duration: 1
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendVerificationOTPEmail, verifyUserEmail, sendEmailAccountblocked, sendEmailStatusUserAdmin };