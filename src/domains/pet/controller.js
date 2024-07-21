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

const updatePet = async (petId, updateData) => {
    try {
        const pet = await Pet.findById(petId);

        if (!pet) {
            throw new Error("Mascota no encontrada");
        }

        for (const [key, value] of Object.entries(updateData)) {
            pet[key] = value;
        }

        // Guarda los cambios en la base de datos
        const updatedPet = await pet.save();
        return updatedPet;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deshabilitarMascota = async (data) => {
    try {
        const { id } = data;

        const service = await Pet.findByIdAndUpdate(
            id,
            { estado: 'indisponible' },
            { new: true }
        );

        if (!service) {
            throw new Error("Mascota no encontrada");
        }

        return service;
    } catch (error) {
        throw new Error(error.message);
    }
};

const habilitarMascota = async (data) => {
    try {
        const { id } = data;

        const service = await Pet.findByIdAndUpdate(
            id,
            { estado: 'disponible' },
            { new: true }
        );

        if (!service) {
            throw new Error("Mascota no encontrada");
        }

        return service;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createNewPet, getPetByUserId, getPets, updatePet, deshabilitarMascota, habilitarMascota };