const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreguntaFrecuenteSchema = new Schema({
    pregunta: {
        type: String,
        required: true
    },
    respuesta: {
        type: String,
        required: true
    },
    activa: {
        type: Boolean,
        default: true
    }
});

const PreguntaFrecuente = mongoose.model('PreguntaFrecuente', PreguntaFrecuenteSchema);

module.exports = PreguntaFrecuente;
