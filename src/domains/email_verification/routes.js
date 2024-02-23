const express = require("express");
const router = express.Router();
const { sendVerificationOTPEmail, verifyUserEmail } = require("./controller");

router.post("/verify", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!(email && otp)) throw Error("No se permiten detalles otp vacíos.");

        await verifyUserEmail({ email, otp });
        res.status(200).json({ email, verified: true});
        res.status(200).json({
            email,
            verified: true,
            msj: "Tu cuenta ha sido activada correctamente, ahora puedes iniciar sesión."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// request new verification otp
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) throw Error("Se requiere un correo electrónico!");

        const createdEmailVerificationOTP = await sendVerificationOTPEmail(email);
        res.status(200).json(createdEmailVerificationOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;