const express = require("express");
const router = express.Router();
const { generateTokenAcceso, verifyTokenAcceso } = require("./controller");

router.get("/verify/:token/:tToken", async (req, res) => {
    try {
        let { token, tToken } = req.params;

        const validTokenAcceso = await verifyTokenAcceso({ token, tToken });

        return res.status(200).json({
            validTokenAcceso
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// request new verification otp
router.post("/:tokenUsuario/:tipo", async (req, res) => {
    try {
        const { tokenUsuario, tipo } = req.params;

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