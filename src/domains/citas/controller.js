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
        const existingCita = await Cita.findOne({ mascota, fecha });
        if (existingCita) {
            throw new Error(`Ya ha agendado una cita para la mascota: ${mascota}, el dia de ${fecha}`);
        }

        const { usuario, mascota, servicio, medico, fecha, hora, comentarios } = data;
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

const getCitasByFechaByMedico = async (fecha, medico) => {
    try {
        const citas = await Cita.find({ fecha: fecha, medico: medico }).populate('usuario mascota servicio medico');
        return citas;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { createNewCita, getCitaByUserId, getCitasByFechaByMedico, getCitas, getValidationPet };