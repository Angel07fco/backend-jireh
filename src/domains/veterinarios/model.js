const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicoSchema = new Schema({
    nombre: { type: String, require: true },
    fechaNac: { type: String, require: true, unique: true },
    genero: { type: String, default: null },
    estadoCivil: { type: String, default: null },
    img: { type: String, default: "https://res.cloudinary.com/dl8odylct/image/upload/v1712498540/jireh/veterinario_qo6l0e.png" },
    domicilio: {
        ciudad: { type: String, default: null },
        municipio: { type: String, default: null },
        localidad: { type: String, default: null },
        codigoPostal: { type: String, default: null },
        direccion: { type: String, default: null }
    },
    phone: { type: String, require: true, unique: true },
    email: { type: String, require: true },
    descripcion: { type: String, default: null },
    createdMedico: { type: Date, default: Date.now()}
});

const Veterinario = mongoose.model("Veterinario", MedicoSchema);

module.exports = Veterinario;