const express = require("express");
const router = express.Router();
const {
  saveSubscription,
  sendNotificationController,
} = require("./controller");

// Ruta para guardar la suscripción (el frontend enviará los datos)
router.post("/subscribe", async (req, res) => {
  const { subscription } = req.body; // Extraemos los datos del cuerpo de la solicitud

  try {
    const result = await saveSubscription(subscription); // Llamamos al controlador con los datos
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta para enviar una notificación
router.post("/send", sendNotificationController);

module.exports = router;
