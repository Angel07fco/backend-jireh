const express = require("express");
const router = express.Router();
const { generateTokenAcceso, verifyTokenAcceso } = require("./controller");

router.post("/verify", async (req, res) => {
    try {
        let { token, tToken } = req.body;

        const validTokenAcceso = await verifyTokenAcceso({ token, tToken });
        res.status(200).json({
            idUsuario: validTokenAcceso._id,
            user: validTokenAcceso.user,
            email: validTokenAcceso.email
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// request new verification otp
router.post("/", async (req, res) => {
    try {
        const { tokenUsuario, tipo } = req.body;

        const cretedTokenAcceso = await generateTokenAcceso({
            tokenUsuario,
            tipo
        });
        res.status(200).json(cretedTokenAcceso);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;