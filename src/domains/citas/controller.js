const moment = require("moment");
const Cita = require("./model");

const getValidationPet = async (fecha, mascota) => {
    let validation = false;
    try {
        const existingCita = await Cita.findOne({ mascota, fecha });
        if (existingCita) {
            validation = true;
        }
        return validation;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createNewCita = async (data) => {
    try {
        const { usuario, mascota, servicio, medico, fecha, hora, comentarios } = data;
        const existingCita = await Cita.findOne({ mascota, fecha });
        if (existingCita) {
            throw new Error(`Ya se ha agendado una cita para su mascota el dia ${fecha}`);
        }

        const newCita = new Cita({
            usuario,
            mascota,
            servicio,
            medico,
            fecha,
            hora,
            comentarios,
            citaCreated: moment().format('DD MM YYYY, hh:mm:ss a')
        });
        const createdCita = await newCita.save();
        return createdCita;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitas = async () => {
    try {
        const cita = await Cita.find().populate('usuario mascota servicio medico');
        return cita;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitaByUserId = async (usuario) => {
    try {
        const cita = await Cita.find({ usuario }).populate('usuario mascota servicio medico');
        if (!cita) {
            throw new Error("Usuario no encontrado");
        }
        return cita;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitaByUserIdProximas = async (usuario) => {
    try {
        const citasProximas = await Cita.find({ usuario, estado: 'proxima' }).populate('usuario mascota servicio medico');
        if (!citasProximas || citasProximas.length === 0) {
            throw new Error("No se encontraron citas próximas para este usuario.");
        }
        return citasProximas;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitaByUserIdRealizadas = async (usuario) => {
    try {
        const citasRealizadas = await Cita.find({ usuario, estado: 'realizada' }).populate('usuario mascota servicio medico');
        if (!citasRealizadas || citasRealizadas.length === 0) {
            throw new Error("No se encontraron citas realizadas para este usuario.");
        }
        return citasRealizadas;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitaByUserIdFechaHora = async (usuario, fecha, hora) => {
    try {
        const cita = await Cita.findOne({ usuario, fecha, hora }).populate('usuario mascota servicio medico');
        if (!cita) {
            throw new Error("Cita no encontrada");
        }
        return cita;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitaByUserIdWearOs = async (usuario) => {
    try {
        const cita = await Cita.find({ usuario }).populate('usuario mascota servicio medico');
        if (!cita) {
            throw new Error("Usuario no encontrado");
        }
        return cita;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitasByFechaByMedico = async (fecha, medico) => {
    try {
        const citas = await Cita.find({ fecha: fecha, medico: medico }).populate('usuario mascota servicio medico');
        return citas;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteCita = async (citaId) => {
    try {
        const cita = await Cita.findById(citaId);
        if (!cita) {
            throw new Error("Cita no encontrada");
        }

        // Obtener la fecha actual y de la cita
        const fechaActual = moment();
        const fechaCita = moment(cita.fecha, 'DD-MM-YYYY');

        // Calcular la diferencia en días
        const diferenciaDias = fechaCita.diff(fechaActual, 'days');
        let diffDias = diferenciaDias + 1;

        let msg = "";
        // Verificar si la cita se puede cancelar (si es al menos dos días antes)
        if (diffDias > 1) {
            await Cita.findByIdAndDelete(citaId);
            msg = "La cita ha sido cancelada correctamente.";
        } else {
            msg = "No se puede cancelar la cita. Debe ser al menos dos días antes de la cita.";
        }

        return msg;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateCita = async (citaId, updateData) => {
    try {
        const cita = await Cita.findById(citaId);

        if (!cita) {
            throw new Error("Cita no encontrada");
        }

        // Obtener la fecha actual y de la cita
        const fechaActual = moment();
        const fechaCita = moment(cita.fecha, 'DD-MM-YYYY');

        // Calcular la diferencia en días
        const diferenciaDias = fechaCita.diff(fechaActual, 'days');
        let diffDias = diferenciaDias + 1;

        let msg = "";
        if (diffDias > 0) {
            for (const [key, value] of Object.entries(updateData)) {
                cita[key] = value;
            }
            // Guarda los cambios en la base de datos
            await cita.save();
            msg = "La cita ha sido actualizada correctamente.";
        } else {
            msg = "No se puede actualizar la cita. Debe ser al menos 1 día antes de la cita.";
        }
        return msg;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCountCitasByFechaAndEstado = async (fecha) => {
    try {
        const estados = ['realizada', 'en vivo', 'en proceso de finalizar', 'proxima'];
        const counts = {};

        for (const estado of estados) {
            counts[estado] = await Cita.countDocuments({ fecha, estado });
        }

        return counts;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getCitasByFecha = async (fecha) => {
    try {
        const citas = await Cita.find({ fecha }).populate('usuario mascota servicio medico');
        return citas;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createNewCita,
    getCitaByUserId,
    getCitaByUserIdProximas,
    getCitaByUserIdRealizadas,
    getCitaByUserIdFechaHora,
    getCitasByFechaByMedico,
    getCitas,
    getValidationPet,
    deleteCita,
    getCitaByUserIdWearOs,
    updateCita,
    getCountCitasByFechaAndEstado,
    getCitasByFecha };