const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalificacionCitaSchema = new Schema({
    cita: { type: Schema.Types.ObjectId, ref: 'Cita', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    servicio: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    medico: { type: Schema.Types.ObjectId, ref: 'Veterinario', required: true },
    calificacionAtencion: { type: Number, min: 0, max: 5, required: true },
    calidadAtencion: { type: Number, min: 0, max: 5, required: true },
    instalaciones: { type: Number, min: 0, max: 5, required: true },
    comunicacion: { type: Number, min: 0, max: 5, required: true },
    facilidadPago: { type: Number, min: 0, max: 5, required: true },
    experienciaCliente: { type: String, required: true },
    recomendaciones: { type: String, required: true },
    satisfaccionCliente: { type: Number, min: 0, max: 5, required: true },
    comentarios: { type: String, required: true },
    fechaCalificacion: { type: Date, default: Date.now }
});

const CalificacionCita = mongoose.model("CalificacionCita", CalificacionCitaSchema);

module.exports = CalificacionCita;