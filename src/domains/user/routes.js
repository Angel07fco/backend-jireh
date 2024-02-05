const express = require("express");
const router = express.Router();
const { createNewUser } = require("./controller");

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

        res.status(200).json({ success: true, user: newUser });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;