const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenAccesoSchema = new Schema({
    tokenUsuario: String,
    token: String,
    tipoToken: String,
    createAt : Date,
    expiresAt: Date
});

const TokenAcceso = mongoose.model("TokenAcceso", TokenAccesoSchema);

module.exports = TokenAcceso;