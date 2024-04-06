const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");
const ForgotPasswordRoutes = require("./../domains/forgot_password");
const servicesRoutes = require("./../domains/servicios");
const petsRoutes = require("./../domains/pet");
const citasRoutes = require("./../domains/citas");
const logSession = require("./../domains/log_inicio_sesion");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

router.use("/services", servicesRoutes);
router.use("/pet", petsRoutes);
router.use("/cita", citasRoutes);

router.use("/log_inicio_sesion", logSession);

module.exports = router;