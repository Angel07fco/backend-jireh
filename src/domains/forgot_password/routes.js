const express = require("express");
const router = express.Router();
const { sendPasswordResetOTPEmail, resetUserPassword } = require("./controller");

router.post("/reset", async (req, res) => {
    try {
        let { email, otp, newPassword} = req.body;
        if (!(email && otp && newPassword)) throw Error("Credenciales no validas.");

        await resetUserPassword({ email, otp, newPassword });
        res.status(200).json({ email, passwordreset: true });
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// Password reset request
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) throw Error("Email es requerido.");

        const createdPasswordResetOTP = await sendPasswordResetOTPEmail(email);
        res.status(200).json(createdPasswordResetOTP);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;