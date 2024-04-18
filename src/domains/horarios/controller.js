const Horario = require("./model");

const getHorariosDisponibles = async (medicoId, dia) => {
    try {
        // Buscar los horarios para el médico y día especificados
        const horarios = await Horario.findOne({ medico: medicoId, date: dia });

        // Verificar si se encontraron horarios para ese día y médico
        if (!horarios) {
            return [];
        }

        // Devolver solo los campos horaInicio y horaFin
        return {
            horaInicio: horarios.horaInicio,
            horaFin: horarios.horaFin
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const createdHorarios = async (data) => {
    const { medicoId, dia, horaInicio, horaFin } = data;

    try {
        // Verificar si ya existe un horario registrado para el médico en el día especificado
        const existingHorarios = await Horario.findOne({ medico: medicoId, date: dia });

        // Si ya existe un horario registrado para ese día y médico, lanzar un error
        if (existingHorarios) {
            throw new Error(`Ya existen horarios registrados para el día ${dia}`);
        }

        // Si no existe un horario registrado para ese día y médico, guardar el nuevo horario
        const newHorarios = new Horario({
            medico: medicoId,
            date: dia,
            horaInicio,
            horaFin
        });
        await newHorarios.save();
        return newHorarios;
    } catch (error) {
        throw new Error(error.message);
    }
};

const actualizarHorario = async (data) => {
    const { medicoId, dia, horaInicio, horaFin } = data;

    try {
        // Verificar si ya existe un horario registrado para el médico en el día especificado
        const nuevosDatos = await Horario.findOne({ medico: medicoId, date: dia });

        // Si ya existe un horario registrado para ese día y médico, lanzar un error
        if (!nuevosDatos) {
            throw new Error(`No existen horarios registrados para el día ${dia}`);
        }

        // Actualizar los campos de horaInicio y horaFin si están presentes en los nuevos datos
        if (nuevosDatos.horaInicio) {
            nuevosDatos.horaInicio = horaInicio;
        }
        if (nuevosDatos.horaFin) {
            nuevosDatos.horaFin = horaFin;
        }

        // Guardar los cambios
        const horarioActualizado = await nuevosDatos.save();
        return horarioActualizado;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getHorariosDisponibles, createdHorarios, actualizarHorario };