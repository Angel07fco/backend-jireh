const CalificacionCita = require("./model");
const Cita = require("../citas/model");

// Crear nueva calificación de cita
const createCalificacionCita = async (data) => {
    try {
        const { cita } = data;
        const newCalificacionCita = new CalificacionCita(data);

        console.log(cita)

        await Cita.findByIdAndUpdate(cita, { opinionUsuario: true }, { new: true });

        const createdCalificacionCita = await newCalificacionCita.save();
        return createdCalificacionCita;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Obtener todas las calificaciones de citas
const getCalificacionesCitas = async () => {
    try {
        const calificacionesCitas = await CalificacionCita.find().populate('usuario cita servicio medico');

        const formattedResponse = {
            Cliente_ID: calificacionesCitas.usuario._id,
            Fecha_Visita: calificacionesCitas.cita.fecha,
            Tipo_Servicio: calificacionesCitas.servicio.name,
            Tiempo_Espera: calificacionesCitas.tiempoEspera,
            Duración_Atención: calificacionesCitas.duracion,
            Costo_Servicio: calificacionesCitas.costo,
            Personal_Atención: calificacionesCitas.medico._id,
            Calidad_Atención: calificacionesCitas.calidadAtencion,
            Instalaciones: calificacionesCitas.instalaciones,
            Comunicación: calificacionesCitas.comunicacion,
            Facilidad_Pago: calificacionesCitas.facilidadPago,
            Experiencia_Cliente: calificacionesCitas.experienciaCliente,
            Recomendaciones: calificacionesCitas.recomendaciones,
            Satisfaccion_Cliente: calificacionesCitas.satisfaccionCliente,
        };
        res.status(200).json(formattedResponse);
    } catch (error) {
        throw new Error(error.message);
    }
};

// Obtener calificación de cita por ID
const getCalificacionCitaById = async (id) => {
    try {
        const calificacionCita = await CalificacionCita.findById(id).populate('usuario cita servicio medico');
        if (!calificacionCita) {
            throw new Error("Calificación de cita no encontrada");
        }
        return calificacionCita;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Actualizar calificación de cita por ID
const updateCalificacionCita = async (id, updateData) => {
    try {
        const calificacionCita = await CalificacionCita.findById(id);
        if (!calificacionCita) {
            throw new Error("Calificación de cita no encontrada");
        }
        for (const [key, value] of Object.entries(updateData)) {
            calificacionCita[key] = value;
        }
        const updatedCalificacionCita = await calificacionCita.save();
        return updatedCalificacionCita;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createCalificacionCita, getCalificacionesCitas, getCalificacionCitaById, updateCalificacionCita };