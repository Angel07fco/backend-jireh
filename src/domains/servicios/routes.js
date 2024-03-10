const express = require("express");
const router = express.Router();
const { getAllServices, getServiceById, createNewService } = require("./controller");

// Ruta para obtener todos los servicios
router.get("/", async (req, res) => {
    try {
        const services = await getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const service = await getServiceById(id);
        res.status(200).json(service);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.post("/newservice", async (req, res) => {
    let {name, description, price } = req.body;

    try {
        if (!(name && description && price)) {
            throw Error("Credenciales ingresadas vacias!");
        } else {
            // good credentials, create new user
            const newService = await createNewService({
                name,
                description,
                price
            });
            res.status(200).json({
                id: newService._id,
                name: newService.name,
                msj: "Se ha creado un nuevo servicio correctamente.",
                createdAt: newService.createdAt,
                updatedAt: newService.updatedAt
            });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;