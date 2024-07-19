const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const { getPreguntasFrecuentes, createdFaq, updateFaq, deleteFaq } = require("./controller");

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


// Editar blog
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const upFaq = await updateFaq(id, req.body);
        res.status(200).json({
            id: upFaq._id,
            msj: "Se ha actualizado correctamente la Pregunta Frecuente.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Eliminar blog
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delFaq = await deleteFaq(id);
        res.status(200).json({
            id: delFaq._id,
            msj: "Se ha eliminado correctamente la Pregunta Frecuente.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;