const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser, logoutUserSession, getUserById } = require("./controller");
const auth = require("./../../middleware/auth");
const { sendVerificationOTPEmail } = require("./../email_verification/controller");

// protected route
router.get("/private_data", auth, (req, res) => {
    res.
        status(200)
        .send(`You're in the private territory of ${req.currentUser.email}`);
})

// Obtener un usuario
router.get("/obtenerusuario/:token", async (req, res) => {
    const { token } = req.params;
    try {
        const userById = await getUserById(token);
        res.status(200).json(userById);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// Signin
router.post("/", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!(email && password)) {
            throw Error("Credenciales ingresadas vacias!");
        }

        const authenticatedUser = await authenticateUser({ email, password });

        res.status(200).json({
            id: authenticatedUser._id,
            email: authenticatedUser.email,
            token: authenticatedUser.token,
            msj: "Has iniciado sesión correctamente."
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Signup
router.post("/signup", async (req, res)  => {
    let { user, email, phone, password, question_secret, reply_secret } = req.body;

    try {
        user = user.trim();
        email = email.trim();
        phone = phone.trim();
        password = password.trim();
        question_secret = question_secret.trim();
        reply_secret = reply_secret.trim();

        if (!(user && email && phone && password && question_secret && reply_secret)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            // good credentials, create new user
            const newUser = await createNewUser({
                user,
                email,
                phone,
                password,
                question_secret,
                reply_secret
            });
            await sendVerificationOTPEmail(email);
            res.status(200).json({
                id: newUser._id,
                email: newUser.email,
                msj: "Se ha creado su cuenta correctamente",
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/logout", auth, async(req, res) => {
    const { token } = req.body;
    try {
        await logoutUserSession(token);
        res.status(200).json({ message: "Sesión cerrada correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;