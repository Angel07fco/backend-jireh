const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    name: { type: String, required: true },
    img: { type: String },
    icono: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    objective: { type: String },
    price: { type: String, default: "100" },
    duration: { type: Number },
    reactions: { type: String },
    frequency: { type: String },
    duracion: { type: Number }
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;