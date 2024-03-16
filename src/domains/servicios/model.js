const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    name: { type: String, required: true },
    img: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    objective: { type: String },
    price: { type: String, required: true },
    duration: { type: Number },
    reactions: { type: String },
    frequency: { type: String }
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;