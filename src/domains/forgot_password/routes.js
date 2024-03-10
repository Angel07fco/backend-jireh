const express = require("express");
const router = express.Router();
const { sendPasswordResetOTPEmail, resetUserPasswordByReply, resetUserPassword, sendPasswordResetUser } = require("./controller");

router.post("/reset", async (req, res) => {
    try {
        let { email, otp, newPassword} = req.body;
        if (!(email && otp && newPassword)) throw Error("Credenciales no validas.");

        await resetUserPassword({ email, otp, newPassword });
        res.status(200).json({
            email: email,
            msj: "Se ha restablecido la contraseña correctamente."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/resetreply", async (req, res) => {
    try {
        let { email, reply_secret, newPassword } = req.body;
        if (!(email && reply_secret && newPassword)) throw Error("Credenciales no validas.");

        await resetUserPasswordByReply({ email, reply_secret, newPassword });
        res.status(200).json({
            email: email,
            msj: "Se ha restablecido la contraseña correctamente."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Password reset request
router.post("/", async (req, res) => {
    try {
        const { email, indicator } = req.body;
        if (!email) throw Error("Email es requerido.");
        if (!indicator) throw Error("Indicador es requerido.");

        let createdPasswordReset = "";
        let msj = "";

        if (indicator === 1) {
            createdPasswordReset = await sendPasswordResetOTPEmail(email);
            msj = "Código enviado exitosamente, Comprueba tu bandeja de entrada.";
        }
        if (indicator === 2) {
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

module.exports = router;