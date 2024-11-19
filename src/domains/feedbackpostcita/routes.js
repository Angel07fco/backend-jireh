const express = require("express");
const router = express.Router();
const { sendFeedbackPostcita } = require("./controller");

router.post("/", async (req, res) => {
  try {
    const { userId, citaId, pregunta1, pregunta2, pregunta3, comentarios } =
      req.body;

    const createdFeedbackPostcita = await sendFeedbackPostcita({
      userId,
      citaId,
      pregunta1,
      pregunta2,
      pregunta3,
      comentarios,
    });
    res.status(200).json(createdFeedbackPostcita);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
