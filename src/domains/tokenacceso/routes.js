const express = require("express");
const router = express.Router();
const { generateTokenAcceso, verifyTokenAcceso } = require("./controller");

router.get("/verify/:token/:tToken", async (req, res) => {
    let { token, tToken } = req.params;
    try {
        const validTokenAcceso = await verifyTokenAcceso({ token, tToken });
        res.status(200).json({
            id: validTokenAcceso._id,
            email: validTokenAcceso.email,
            user: validTokenAcceso.user
        });
    } catch (error) {
        res.status(400).json({ "errorM": error.message });
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