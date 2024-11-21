const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
  description: { type: String, default: null },
  clasificacion: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

const Gallery = mongoose.model("Gallery", GallerySchema);

module.exports = Gallery;
