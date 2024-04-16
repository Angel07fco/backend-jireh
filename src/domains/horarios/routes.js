const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const { getHorariosDisponibles, createdHorarios } = require("./controller");

// Ruta para agregar un horario
router.post('/:medicoId', async (req, res) => {
    const { medicoId } = req.params;
    const { dia, horarios } = req.body;
    try {
        const createNewHorarios = await createdHorarios({
            medicoId,
            dia,
            horarios
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

// Ruta para deshabilitar horarios
//router.patch('/:veterinarianId/:dia', disableSlots);

module.exports = router;