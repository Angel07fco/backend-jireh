const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HorarioSchema = new mongoose.Schema({
    medico: {
        type: Schema.Types.ObjectId,
        ref: 'Veterinario',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    }
});

const Horario = mongoose.model('Horario', HorarioSchema);

module.exports = Horario;