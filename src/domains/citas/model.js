const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'User' },
    mascota: { type: Schema.Types.ObjectId, ref: 'Pet' },
    servicio: { type: Schema.Types.ObjectId, ref: 'Service' },
    fecha: { type: String, require: true },
    hora: { type: String, require: true },
    comentarios: { type: String },
    citaCreated : { type: String }
});

const Cita = mongoose.model("Cita", CitaSchema);

module.exports = Cita;