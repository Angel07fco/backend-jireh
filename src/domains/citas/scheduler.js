const cron = require('node-cron');
const moment = require('moment');
const mongoose = require('mongoose');
const Cita = require('./model'); // Asegúrate de que la ruta sea correcta

// Función para actualizar el estado de las citas
const updateCitaEstado = async () => {
    const fechaActual = moment().format('DD-MM-YYYY');
    const horaActual = moment();

    try {
        const citas = await Cita.find({ estado: { $in: ['proxima', 'en vivo', 'en proceso de finalizar'] } });

        for (const cita of citas) {
            const [horaInicio, horaFin] = cita.hora.split('-');
            const horaInicioMoment = moment(horaInicio, 'HH:mm');
            const horaFinMoment = moment(horaFin, 'HH:mm');
            const fechaCitaMoment = moment(cita.fecha, 'DD-MM-YYYY');
            const horaFinCita = moment(`${cita.fecha} ${horaFin}`, 'DD-MM-YYYY HH:mm');

            if (fechaCitaMoment.isBefore(moment(), 'day')) {
                cita.estado = 'realizada';
                await cita.save();
            } else if (fechaCitaMoment.isSame(moment(), 'day')) {
                if (horaActual.isBetween(horaInicioMoment, horaFinMoment, null, '[)')) {
                    cita.estado = 'en vivo';
                } else if (horaActual.isAfter(horaFinMoment) && horaActual.isBefore(horaFinCita.add(2, 'hours'))) {
                    cita.estado = 'en proceso de finalizar';
                } else if (horaActual.isSameOrAfter(horaFinCita.add(2, 'hours'))) {
                    cita.estado = 'realizada';
                }
                await cita.save();
            }
        }

        console.log('Estados de las citas actualizados');
    } catch (error) {
        console.error('Error al actualizar el estado de las citas: ', error);
    }
};

const startScheduler = () => {
    cron.schedule('* * * * *', () => {
        console.log('Ejecutando tarea de actualización de citas');
        updateCitaEstado();
    });
};

module.exports = startScheduler;