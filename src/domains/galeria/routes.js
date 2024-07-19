const express = require("express");
const router = express.Router();
const { createNewGaleria, updateGaleria, deleteGaleria, obtenerGalerias, filterByClasificacion, filterByCategory } = require("./controller");

// agregar imagen a galeria
router.post("/", async (req, res) => {
    try {
        const { title, description, clasificacion, category, imageUrl } = req.body;

        const createGaleria = await createNewGaleria({
            title,
            description,
            clasificacion,
            category,
            imageUrl
        });
        res.status(200).json({
            id: createGaleria._id,
            msj: "Se ha agregado correctamente.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Editar imagen en la galería
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedGaleria = await updateGaleria(id, req.body);
        res.status(200).json({
            id: updatedGaleria._id,
            msj: "Se ha actualizado correctamente.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Eliminar imagen en la galería
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGaleria = await deleteGaleria(id);
        res.status(200).json({
            id: deletedGaleria._id,
            msj: "Se ha eliminado correctamente.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Filtrar galerias
router.get("/", async (req, res) => {
    try {
        const galerias = await obtenerGalerias();
        res.status(200).json(galerias);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Filtrar imágenes por clasificación
router.get("/clasificacion/:clasificacion", async (req, res) => {
    try {
        const { clasificacion } = req.params;
        const images = await filterByClasificacion(clasificacion);
        res.status(200).json(images);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Filtrar imágenes por categoría
router.get("/categoria/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const images = await filterByCategory(category);
        res.status(200).json(images);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;