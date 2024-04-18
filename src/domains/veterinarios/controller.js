const moment = require("moment");
const Veterinario = require("./model");

const createdVeterinario = async (data) => {
    try {
        const { nombre, fechaNac, genero, estadoCivil, img, domicilio, phone, email, descripcion } = data;

        const newCreatedVeterinario = new Veterinario({
            nombre,
            fechaNac,
            genero,
            estadoCivil,
            img,
            domicilio,
            phone,
            email,
            descripcion
        });
        const createdVet = await newCreatedVeterinario.save();

        return createdVet;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getVeterinarios = async () => {
    try {
        const vete = await Veterinario.find();
        return vete;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getVeterinario = async (medicoId) => {
    try {
        const vete = await Veterinario.findById(medicoId);

        if (!vete) {
            throw Error("No encontramos ningún médico con ese Id")
        }

        return vete;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createdVeterinario, getVeterinarios, getVeterinario };