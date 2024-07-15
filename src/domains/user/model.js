const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    nombres: { type: String, default: null },
    apellidos: { type: String, default: null },
    img: { type: String, default: "https://res.cloudinary.com/dl8odylct/image/upload/v1710650097/jireh/perfil_jgiucu.png" },
    phone: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    question_secret: { type: String, default: null },
    reply_secret: { type: String, default: null },
    previousPasswords: { type: [String], default: [] },
    userStatus: { type: String, default: null },
    accountStatus: { type: String, default: null },
    rol: { type: String, default: "usuario" },
    accountCreated : { type: String },
    isLogginDate: { type: String, default: null },
    token: { type: String, default: null },
    expiratedTokenDate : { type: String, default: null },
    verified: { type: Boolean, default: false },
    isLogginIntented: { type: Number, default: 0 },
    domicilio: {
        ciudad: { type: String, default: null },
        municipio: { type: String, default: null },
        localidad: { type: String, default: null },
        codigoPostal: { type: String, default: null },
        direccion: { type: String, default: null }
    },
    descripcion: { type: String, default: null }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;