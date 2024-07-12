const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const { getPreguntasFrecuentes, createdFaq } = require("./controller");

// Ruta para agregar un horario
router.post('/', async (req, res) => {
    const { pregunta, respuesta, activa } = req.body;
    try {
        const createNewFaq = await createdFaq({
            pregunta,
            respuesta,
            activa
        });

        res.status(200).json({
            id: createNewFaq._id,
            dia: createNewFaq.dia,
            horariosDisponibles: createNewFaq.horariosDisponibles,
            msj: "Se ha agregado correctamente la Pregunta Frecuente.",
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// Ruta para obtener las preguntas frecuentes
router.get("/", async (req, res) => {
    try {
        const preguntasFrecuentes = await getPreguntasFrecuentes();
        res.status(200).json(preguntasFrecuentes);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;