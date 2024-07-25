const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalificacionCitaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cita: { type: Schema.Types.ObjectId, ref: 'Cita', required: true },
    servicio: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    tiempoEspera : { type: Number, default: 15 },
    duracion: { type: Number, default: 60 },
    costo: { type: Number, default: 60 },
    medico: { type: Schema.Types.ObjectId, ref: 'Veterinario', required: true },
    calidadAtencion: { type: Number, min: 1, max: 5, required: true },
    instalaciones: { type: Number, min: 1, max: 5, required: true },
    comunicacion: { type: Number, min: 1, max: 5, required: true },
    facilidadPago: { type: Number, min: 1, max: 5, required: true },
    experienciaCliente: { type: Number, min: 1, max: 4, required: true },
    recomendaciones: { type: Number, required: true },
    satisfaccionCliente: { type: String, required: true }
});

const CalificacionCita = mongoose.model("CalificacionCita", CalificacionCitaSchema);

module.exports = CalificacionCita;