const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PetSchema = new Schema({
    name: { type: String, require: true },
    categoria: { type: String, require: true },
    especie: { type: String, require: true },
    tamano: { type: String, require: true },
    raza: { type: String, require: true },
    age: { type: String },
    genero: { type: String, require: true },
    peso: { type: String },
    img: { type: String, default: "https://res.cloudinary.com/dl8odylct/image/upload/v1710824019/jireh/animaldefault_khthes.jpg" },
    petCreated : { type: String },
    estado: { type: String, default: "activo" },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;