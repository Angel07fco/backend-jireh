const Horario = require("./model");

const getHorariosDisponibles = async (medicoId, dia) => {
    try {
        // Buscar los horarios para el médico y día especificados
        const horarios = await Horario.findOne({ medico: medicoId, date: dia });

        // Verificar si se encontraron horarios para ese día y médico
        if (!horarios) {
            return [];
        }

        // Devolver los horarios disponibles
        return horarios.horarios;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createdHorarios = async (data) => {
    const { medicoId, dia, horarios } = data;

    try {
        const newHorarios = new Horario({
            medico: medicoId,
            date: dia,
            horarios
        });
        await newHorarios.save();
        return newHorarios;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getHorariosDisponibles, createdHorarios };