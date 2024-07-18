const express = require("express");
const router = express.Router();
const { createNewBlog, updateBlog, deleteBlog, filterByCategory } = require("./controller");


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
        res.status(200).json(createBlog);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Editar blog
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const upBlog = await updateBlog(id, req.body);
        res.status(200).json(upBlog);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Eliminar blog
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delBlog = await deleteBlog(id);
        res.status(200).json(delBlog);
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