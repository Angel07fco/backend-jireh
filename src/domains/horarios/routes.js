const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const { getHorariosDisponibles, createdHorarios, actualizarHorario } = require("./controller");

// Ruta para agregar un horario
router.post('/:medicoId', async (req, res) => {
    const { medicoId } = req.params;
    const { dia, horaInicio, horaFin } = req.body;
    try {
        const createNewHorarios = await createdHorarios({
            medicoId,
            dia,
            horaInicio,
            horaFin
        });

        res.status(200).json({
            id: createNewHorarios._id,
            dia: createNewHorarios.dia,
            msj: "Se han agregado correctamente los horarios",
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// Ruta para obtener los horarios disponibles
router.get("/:medico/:dia", async (req, res) => {
    const { medico, dia } = req.params;

    try {
        const horariosDisponibles = await getHorariosDisponibles(medico, dia);
        res.status(200).json(horariosDisponibles);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Ruta para actualizar un horario
router.patch('/:medicoId', async (req, res) => {
    const { medicoId } = req.params;
    const { dia, horaInicio, horaFin } = req.body;
    try {
        const horarioActualizado = await actualizarHorario({
            medicoId,
            dia,
            horaInicio,
            horaFin
        });
        res.status(200).json({
            id: horarioActualizado._id,
            date: horarioActualizado.date,
            msj: "Se han actualizado correctamente los horarios",
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;
