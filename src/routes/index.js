const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require("./../domains/email_verification");
const ForgotPasswordRoutes = require("./../domains/forgot_password");
const servicesRoutes = require("./../domains/servicios");
const petsRoutes = require("./../domains/pet");
const citasRoutes = require("./../domains/citas");
const veterinariosRoutes = require("./../domains/veterinarios");
const logSession = require("./../domains/log_inicio_sesion");
const horariosRoutes = require("./../domains/horarios");

router.use("/user", userRoutes);
router.use("/otp", OTPRoutes);
router.use("/email_verification", EmailVerificationRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

router.use("/services", servicesRoutes);
router.use("/pet", petsRoutes);
router.use("/cita", citasRoutes);
router.use("/veterinario", veterinariosRoutes);
router.use("/horario", horariosRoutes);

router.use("/log_inicio_sesion", logSession);

module.exports = router;