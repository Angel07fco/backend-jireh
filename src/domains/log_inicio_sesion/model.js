const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logSessionSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'User' },
    isLogDate: { type: String, default: null },
    ip: { type: String, default: null },
    navegador: { type: String, default: null },
    tipo: { type: String, default: null },
    accion: { type: String, default: null },
    descripcion: { type: String, default: null }
});

const LogSession = mongoose.model("LogSession", logSessionSchema);

module.exports = LogSession;