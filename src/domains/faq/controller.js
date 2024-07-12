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

module.exports = { createdFaq, getPreguntasFrecuentes };