const { getCitasByFechaByMedico } = require("../citas/controller");
const Horario = require("./model");
const moment = require("moment");

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
            horaFin: horarios.horaFin,
            horariosDisponibles: horarios.horariosDisponibles
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getHorariosDisponiblesTodos = async (medicoId, dia) => {
    try {
        // Buscar los horarios para el médico y día especificados
        const horarios = await Horario.find({ medico: medicoId });

        // Verificar si se encontraron horarios para ese día y médico
        if (!horarios) {
            return [];
        }

        // Devolver solo los campos horaInicio y horaFin
        return horarios;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Función para generar los horarios disponibles
const generarHorariosDisponibles = (horaInicio, horaFin) => {
    const horariosDisponibles = [];
    let horaActual = moment(horaInicio, 'HH:mm');

    while (horaActual.isBefore(moment(horaFin, 'HH:mm'))) {
        const horaInicioStr = horaActual.format('HH:mm');
        horaActual.add(1, 'hour');
        const horaFinStr = horaActual.format('HH:mm');
        const horarioDisponible = `${horaInicioStr}-${horaFinStr}`;
        horariosDisponibles.push(horarioDisponible);
    }

    return horariosDisponibles;
};

const verificarCitasEnHorarioNuevo = (horarioNuevo, citasAgendadas) => {
    // Convertir los horarios de citas agendadas en un conjunto para una búsqueda más eficiente
    const citasSet = new Set(citasAgendadas);

    // Iterar sobre las citas agendadas
    for (const cita of citasSet) {
        // Verificar si la cita agendada no está en el conjunto del nuevo horario
        if (!horarioNuevo.includes(cita)) {
            return false;
        }
    }

    // Si todas las citas agendadas están dentro del nuevo horario
    return true;
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

        // Generar los horarios disponibles
        const horariosDisponibles = generarHorariosDisponibles(horaInicio, horaFin);

        // Si no existe un horario registrado para ese día y médico, guardar el nuevo horario
        const newHorarios = new Horario({
            medico: medicoId,
            date: dia,
            horaInicio,
            horaFin,
            horariosDisponibles
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
        }else {
            // Comprobar si hay citas agendadas para el médico en el día especificado
            const citas = await getCitasByFechaByMedico(dia, medicoId);

            // Generar los nuevos horarios disponibles
            const horariosDisponibles = generarHorariosDisponibles(horaInicio, horaFin);
            let citasAgendadas = [];
            if (citas.length > 0) {
                citas.map((item, index) => {
                    citasAgendadas.push(item.hora);
                });
                console.log("Horario nuevo: " + horariosDisponibles)
                console.log("Citas agendadas: " + citasAgendadas);
                const vefifyHorario = verificarCitasEnHorarioNuevo(horariosDisponibles, citasAgendadas);
                if (vefifyHorario === false) {
                    throw new Error(`No se puede actualizar el horario porque hay citas agendadas para el dia ${dia} que no se estan incluyendo en el nuevo horario`);
                }
            }

            nuevosDatos.horariosDisponibles = horariosDisponibles;

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
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const eliminarHorario = async (medicoId, dia) => {
    try {
        // Comprobar si hay citas agendadas para el médico en el día especificado
        const citas = await getCitasByFechaByMedico(dia, medicoId);
        if (citas.length > 0) {
            throw new Error(`No se puede eliminar el horario porque hay citas agendadas para el día ${dia}`);
        }

        // Buscar y eliminar el horario correspondiente al médico y día especificados
        const horarioEliminado = await Horario.findOneAndDelete({ medico: medicoId, date: dia });

        if (!horarioEliminado) {
            throw new Error(`No se encontró ningún horario para el día ${dia}`);
        }

        return horarioEliminado;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { getHorariosDisponibles, createdHorarios, actualizarHorario, getHorariosDisponiblesTodos, eliminarHorario };