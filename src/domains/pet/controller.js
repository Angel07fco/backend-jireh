const moment = require("moment");
const Pet = require("../pet/model");

const createNewPet = async (data) => {
    try {
        const { userId, name, categoria, especie, tamano, raza, age, genero, peso, img } = data;

        const newUser = new Pet({
            userId,
            name,
            categoria,
            especie,
            tamano,
            raza,
            age,
            genero,
            peso,
            img,
            petCreated: moment().format('DD MM YYYY, hh:mm:ss a')
        });
        const createdPet = await newUser.save();
        return createdPet;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPets = async () => {
    try {
        const pet = await Pet.find().populate('userId');
        return pet;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPetByUserId = async (userId) => {
    try {
        const pet = await Pet.find({ userId });
        if (!pet) {
            throw new Error("Usuario no encontrado");
        }
        return pet;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createNewPet, getPetByUserId, getPets };