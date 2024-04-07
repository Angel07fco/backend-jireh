const express = require("express");
const router = express.Router();
const auth = require("./../../middleware/auth");
const { createdVeterinario, getVeterinarios } = require("./controller");

router.post("/newveterinario", auth, async (req, res) => {
    let { nombre, fechaNac, genero, estadoCivil, img, domicilio, phone, email, descripcion } = req.body;

    try {
        if (!(nombre && fechaNac && genero && phone && email)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            const createNewVeterinario = await createdVeterinario({
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

            res.status(200).json({
                id: createNewVeterinario._id,
                nombre: createNewVeterinario.nombre,
                msj: "Se ha creado un nuevo Médico Veterinario",
                createdAt: createNewVeterinario.createdAt,
                updatedAt: createNewVeterinario.updatedAt
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const veterinarios = await getVeterinarios();
        res.status(200).json(veterinarios);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;