const express = require("express");
const router = express.Router();
const { getAllServices, getServiceById, createNewService } = require("./controller");
const verifyToken = require("../../middleware/auth");

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


// Rutas para admins

// Obtener un servicio
router.get("/admingetservices", verifyToken, async (req, res) => {
    try {
        const services = await getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/newservice", verifyToken, async (req, res) => {
    const { name, img, description, duracion } = req.body;

    try {
        const newService = await createNewService({
            name,
            img,
            description,
            duracion
        });
        res.status(200).json({
            id: newService._id,
            name: newService.name,
            msj: "Se ha creado un nuevo servicio correctamente.",
            createdAt: newService.createdAt,
            updatedAt: newService.updatedAt
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router;