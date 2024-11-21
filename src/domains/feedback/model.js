const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Feedback = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  citaId: { type: Schema.Types.ObjectId, ref: "Cita" },
  pregunta1: { type: Number, min: 1, max: 5, required: true },
  pregunta2: { type: Number, min: 1, max: 5, required: true },
  pregunta3: { type: Number, min: 1, max: 5, required: true },
  comentarios: { type: String, required: true },
  fecha: { type: Date, default: Date },
});

const FeedbackPostAgendamiento = mongoose.model("Feedback", Feedback);

module.exports = FeedbackPostAgendamiento;
