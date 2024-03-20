const express = require("express");
const router = express.Router();
const { sendPasswordResetOTPEmail, sendPasswordResetUser, validateUserReply, validateUserOTP, resetPassword } = require("./controller");

// Función para seleccionar el método de recuperación
router.post("/", async (req, res) => {
    try {
        const { email, indicator } = req.body;
        if (!email) throw Error("Email es requerido.");
        if (!indicator) throw Error("Indicador es requerido.");

        let createdPasswordReset = "";
        let msj = "";

        if (indicator === "1") {
            createdPasswordReset = await sendPasswordResetOTPEmail(email);
            msj = "Código enviado exitosamente, Comprueba tu bandeja de entrada.";
        }
        if (indicator === "2") {
            createdPasswordReset = await sendPasswordResetUser(email);
            msj = "Ahora puede escribir su respuesta";
        }

        res.status(200).json({
            createdPasswordReset,
            msj: msj
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Función para validar la respuesta a la pregunta secreta del usuario
router.post("/validatereply", async (req, res) => {
    try {
        let { email, reply_secret } = req.body;

        if (!(email && reply_secret)) throw Error("Credenciales no validas.");
        await validateUserReply({ email, reply_secret });
        res.status(200).json({
            email: email,
            msj: "La respuesta es correcta, puede continuar..."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Función para validar el código OTP enviado al email
router.post("/validateotp", async (req, res) => {
    try {
        let { email, otp } = req.body;

        if (!(email && otp)) throw Error("Credenciales no validas.");
        await validateUserOTP({ email, otp });
        res.status(200).json({
            email: email,
            msj: "El código de 4 digitos es correcto, puede continuar..."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/reset", async (req, res) => {
    try {
        let { email, newPassword} = req.body;
        if (!(email && newPassword)) throw Error("Credenciales no validas.");

        await resetPassword({ email, newPassword });
        res.status(200).json({
            email: email,
            msj: "Se ha restablecido la contraseña correctamente."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});



module.exports = router;