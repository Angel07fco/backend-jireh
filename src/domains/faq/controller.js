const Faq = require("./model");
const moment = require("moment");

const createdFaq = async (data) => {
    const { pregunta, respuesta, activa } = data;

    try {
        const newFaq = new Faq({
            pregunta: pregunta,
            respuesta: respuesta,
            activa: activa
        });
        await newFaq.save();
        return newFaq;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPreguntasFrecuentes = async () => {
    try {
        // Buscar los horarios para el médico y día especificados
        const faq = await Faq.find();

        return faq
    } catch (error) {
        throw new Error(error.message);
    }
};

// Editar una imagen en la galería
const updateFaq = async (id, data) => {
    try {
        const updateBlog = await Faq.findByIdAndUpdate(id, data, { new: true });
        if (!updateBlog) {
            throw Error("Faq no encontrado");
        }
        return updateBlog;
    } catch (error) {
        throw error;
    }
};

// Eliminar una imagen en la galería
const deleteFaq = async (id) => {
    try {
        const deleteFaq = await Faq.findByIdAndDelete(id);
        if (!deleteFaq) {
            throw Error("Faq no encontrado");
        }
        return deleteFaq;
    } catch (error) {
        throw error;
    }
};

module.exports = { createdFaq, getPreguntasFrecuentes, updateFaq, deleteFaq };