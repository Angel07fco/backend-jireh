const Gallery = require("./model");

const createNewGaleria = async ({ description, clasificacion, imageUrl }) => {
  try {
    if (!(clasificacion && imageUrl)) {
      throw Error("Proporcionar valores para clasificación e imagen");
    }

    const newGaleria = await new Gallery({
      description,
      clasificacion,
      imageUrl,
      dateAdded: Date.now(),
    });

    const createdGaleria = await newGaleria.save();
    return createdGaleria;
  } catch (error) {
    throw error;
  }
};

// Editar una imagen en la galería
const updateGaleria = async (id, data) => {
  try {
    const updatedGaleria = await Gallery.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedGaleria) {
      throw Error("Imagen no encontrada");
    }
    return updatedGaleria;
  } catch (error) {
    throw error;
  }
};

// Eliminar una imagen en la galería
const deleteGaleria = async (id) => {
  try {
    const deletedGaleria = await Gallery.findByIdAndDelete(id);
    if (!deletedGaleria) {
      throw Error("Imagen no encontrada");
    }
    return deletedGaleria;
  } catch (error) {
    throw error;
  }
};

// Filtrar todas galerias
const obtenerGalerias = async () => {
  try {
    const galerias = await Gallery.find();
    return galerias;
  } catch (error) {
    throw error;
  }
};

// Filtrar imágenes por clasificación
const filterByClasificacion = async (clasificacion) => {
  try {
    const images = await Gallery.find({ clasificacion });
    return images;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewGaleria,
  updateGaleria,
  deleteGaleria,
  obtenerGalerias,
  filterByClasificacion,
};
