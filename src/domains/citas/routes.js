const express = require("express");
const router = express.Router();
const { createNewCita, getCitaByUserId, getCitasByFechaByMedico, getCitas, getValidationPet, deleteCita, updateCita } = require("./controller");
const auth = require("../../middleware/auth");

router.get("/validation/:fecha/:mascota", auth, async (req, res) => {
    const { fecha, mascota } = req.params;
    try {
        const validationPet = await getValidationPet(fecha, mascota);
        res.status(200).json(validationPet);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/newcita", auth, async (req, res) => {
    let { usuario, mascota, servicio, medico, fecha, hora, comentarios } = req.body;
    try {
        if (!(usuario && mascota && servicio && fecha && hora && comentarios)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            const newCita = await createNewCita({
                usuario,
                mascota,
                servicio,
                medico,
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

router.get("/", auth, async (req, res) => {
    try {
        const citas = await getCitas();
        const citasReducidas = citas.map(cita => ({
            id: cita.id,
            usuario: cita.usuario.user,
            mascota: cita.mascota.name,
            servicio: cita.servicio.name,
            medico: cita.medico.nombre,
            fecha: cita.fecha,
            hora: cita.hora
        }));
        res.status(200).json(citasReducidas);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:usuario", async(req, res) => {
    const { usuario } = req.params;

    try {
        const citas = await getCitaByUserId(usuario);
        res.status(200).json(citas);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/citas/:medico/:fecha", auth, async(req, res) => {
    const { medico, fecha } = req.params;

    try {
        const citasByFechaByMedico = await getCitasByFechaByMedico(fecha, medico);
        const citasReducidas = citasByFechaByMedico.map(cita => ({
            id: cita.id,
            hora: cita.hora
        }));
        res.status(200).json(citasReducidas);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete("/cancelar/:citaId", auth, async (req, res) => {
    const { citaId } = req.params;

    try {
        const estadoCita = await deleteCita(citaId);
        res.status(200).json({ mensaje: estadoCita });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/actualizar/:citaId", auth, async (req, res) => {
    const { citaId } = req.params;
    const updateData = req.body;

    try {
        const updatedCita = await updateCita(citaId, updateData);
        res.status(200).json({ mensaje: updatedCita });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;