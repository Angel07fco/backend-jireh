const express = require("express");
const router = express.Router();
const {
  sendFeedbackPostAgendamiento,
  getPregunta1StatsWeb,
  getPregunta2StatsWeb,
  getPregunta3StatsWeb,
  getPregunta1StatsMovil,
  getPregunta2StatsMovil,
  getPregunta3StatsMovil,
} = require("./controller");

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

router.get("/web/pregunta1", async (req, res) => {
  try {
    const feedback = await getPregunta1StatsWeb();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/web/pregunta2", async (req, res) => {
  try {
    const feedback = await getPregunta2StatsWeb();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/web/pregunta3", async (req, res) => {
  try {
    const feedback = await getPregunta3StatsWeb();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/movil/pregunta1", async (req, res) => {
  try {
    const feedback = await getPregunta1StatsMovil();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/movil/pregunta2", async (req, res) => {
  try {
    const feedback = await getPregunta2StatsMovil();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/movil/pregunta3", async (req, res) => {
  try {
    const feedback = await getPregunta3StatsMovil();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
