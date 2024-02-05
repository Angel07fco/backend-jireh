const express = require("express");
const router = express.Router();
const { createNewUser, authenticateUser } = require("./controller");
const auth = require("./../../middleware/auth");

// protected route
router.get("/private_data", auth, (req, res) => {
    res.
        status(200)
        .send(`You're in the private territory of ${req.currentUser.email}`);
})

// Signin
router.post("/", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!(email && password)) {
            throw Error("Empty credentials supplied!");
        }

        const authenticatedUser = await authenticateUser({ email, password });

        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Signup
router.post("/signup", async (req, res)  => {
    try {
        let { name, email, password } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();  // Corregir aquí

        if (!(name && email && password)) {
            throw new Error("Empty input fields!");
        }

        if (!/^[a-zA-Z ]*$/.test(name)) {
            throw new Error("Invalid name entered");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw new Error("Invalid email entered");
        }

        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            throw new Error("Password is too short or lacks complexity!");
        }

        const newUser = await createNewUser({
            name,
            email,
            password,
        });

        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;