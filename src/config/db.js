require("dotenv").config();
const mongoose = require("mongoose");

// URI de la base de datos
const { MONGODB_URI } = process.env;

const connectToDB = async () => {
  try {
    // Conexión a la base de datos sin las opciones deprecated
    await mongoose.connect(MONGODB_URI);
    console.log("BD conectada");
  } catch (error) {
    console.log("Error al conectar a la base de datos:", error);
  }
};

connectToDB();
