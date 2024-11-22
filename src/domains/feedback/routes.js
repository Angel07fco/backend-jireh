const express = require("express");
const router = express.Router();
const { sendFeedbackPostAgendamiento } = require("./controller");

router.post("/", async (req, res) => {
  try {
    const { userId, citaId, dispositivo, pregunta1, pregunta2, pregunta3 } =
      req.body;

    const cretedFeedbackPostAgendamiento = await sendFeedbackPostAgendamiento({
      userId,
      citaId,
      dispositivo,
      pregunta1,
      pregunta2,
      pregunta3,
    });
    res.status(200).json(cretedFeedbackPostAgendamiento);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
