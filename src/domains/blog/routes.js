const express = require("express");
const router = express.Router();
const { createNewBlog, updateBlog, deleteBlog, obtenerBlogs, filterByCategory } = require("./controller");


// agregar blog
router.post("/", async (req, res) => {
    try {
        const { title, content, categories, imageUrl } = req.body;

        const createBlog = await createNewBlog({
            title,
            content,
            categories,
            imageUrl
        });
        res.status(200).json({
            id: createBlog._id,
            msj: "Se ha agregado correctamente el Blog.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Editar blog
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const upBlog = await updateBlog(id, req.body);
        res.status(200).json({
            id: upBlog._id,
            msj: "Se ha actualizado correctamente el Blog.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Eliminar blog
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delBlog = await deleteBlog(id);
        res.status(200).json({
            id: delBlog._id,
            msj: "Se ha eliminado correctamente el Blog.",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Filtrar blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await obtenerBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Filtrar blogs por categoría
router.get("/categoria/:categories", async (req, res) => {
    try {
        const { categories } = req.params;
        const blogs = await filterByCategory(categories);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;