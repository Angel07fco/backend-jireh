const express = require("express");
const router = express.Router();
const { createNewCita, getCitaByUserId } = require("./controller");
const auth = require("../../middleware/auth");

router.post("/newcita", auth, async (req, res) => {
    let { usuario, mascota, servicio, fecha, hora, comentarios } = req.body;
    try {
        if (!(usuario && mascota && servicio && fecha && hora && comentarios)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            const newCita = await createNewCita({
                usuario,
                mascota,
                servicio,
                fecha,
                hora,
                comentarios
            });
            res.status(200).json({
                id: newCita._id,
                name: newCita.fecha,
                msj: "Se ha agendado una nueva cita.",
                createdAt: newCita.createdAt,
                updatedAt: newCita.updatedAt
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:usuario", auth, async(req, res) => {
    const { usuario } = req.params;

    try {
        const citas = await getCitaByUserId(usuario);
        res.status(200).json(citas);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;