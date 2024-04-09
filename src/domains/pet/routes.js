const express = require("express");
const router = express.Router();
const { createNewPet, getPetByUserId, getPets, updatePet } = require("../pet/controller");
const auth = require("../../middleware/auth");

router.post("/newpet", auth, async (req, res)  => {
    let { userId, name, categoria, especie, tamano, raza, age, genero, peso, img } = req.body;

    try {
        name = name.trim();
        categoria = categoria.trim();
        especie = especie.trim();
        tamano = tamano.trim();
        raza = raza.trim();
        age = age.trim();
        genero = genero.trim();
        peso = peso.trim();

        if (!(userId && name && categoria && especie && tamano && raza && genero)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            const newPet = await createNewPet({
                userId,
                name,
                categoria,
                especie,
                tamano,
                raza,
                age,
                genero,
                peso,
                img
            });
            res.status(200).json({
                id: newPet._id,
                name: newPet.name,
                msj: "Se ha agregado una nueva mascota a su perfil.",
                createdAt: newPet.createdAt,
                updatedAt: newPet.updatedAt
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const pets = await getPets();
        const petReducido = pets.map(pet => ({
            id: pet.id,
            usuario: pet.userId.user,
            mascota: pet.name,
            imagen: pet.img,
            categoria: pet.categoria,
            especie: pet.especie,
            raza: pet.raza,
            genero: pet.genero,
            tamano: pet.tamano,
            age: pet.age,
            peso: pet.peso
        }));
        res.status(200).json(petReducido);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get("/:userId", auth, async(req, res) => {
    const { userId } = req.params;

    try {
        const pets = await getPetByUserId(userId);
        res.status(200).json(pets);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/actualizar/:petId", auth, async (req, res) => {
    const { petId } = req.params;
    const updateData = req.body;

    try {
        const updatePett = await updatePet(petId, updateData);
        res.status(200).json({
            id: updatePett._id,
            msj: "Se ha actualizado correctamente",
            createdAt: updatePett.createdAt,
            updatedAt: updatePett.updatedAt
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;