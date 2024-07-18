const Blog = require("./model");

const createNewBlog = async ({ title, content, categories, imageUrl }) => {
    try {
        if (!(title, content, categories, imageUrl)) {
            throw Error("Proporcionar valores para titulo, contenido, categoria e imagen");
        }

        const newBlog = await new Blog({
            title,
            content,
            categories,
            imageUrl,
            datePosted: Date.now(),
        });

        const createdBlog = await newBlog.save();
        return createdBlog;
    } catch (error) {
        throw error;
    }
};

// Editar una imagen en la galería
const updateBlog = async (id, data) => {
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
        if (!updateBlog) {
            throw Error("Blog no encontrado");
        }
        return updateBlog;
    } catch (error) {
        throw error;
    }
};

// Eliminar una imagen en la galería
const deleteBlog = async (id) => {
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        if (!deleteBlog) {
            throw Error("Blog no encontrado");
        }
        return deleteBlog;
    } catch (error) {
        throw error;
    }
};

// Filtrar imágenes por categoría
const filterByCategory = async (categories) => {
    try {
        const blog = await Blog.find({ categories });
        return blog;
    } catch (error) {
        throw error;
    }
};

module.exports = { createNewBlog, updateBlog, deleteBlog, filterByCategory };