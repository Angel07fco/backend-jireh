const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);

module.exports = router;