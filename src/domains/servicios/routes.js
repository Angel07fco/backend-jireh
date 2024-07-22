const express = require("express");
const router = express.Router();
const { getAllServices, getAllServicesAdmin, getServiceById, createNewService, deshabilitarService, habilitarService, updateServicio, deleteServicio } = require("./controller");
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

// Obtener todos los servicios para admin
router.get('/adminservices', async (req, res) => {
    try {
        const services = await getAllServicesAdmin();
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

router.post("/newservice", verifyToken, async (req, res) => {
    const { name, img, description, icono } = req.body;

    try {
        const newService = await createNewService({
            name,
            img,
            description,
            icono
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

// Editar servicio
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const upServicio = await updateServicio(id, req.body);
        res.status(200).json({
            id: upServicio._id,
            msj: `Se ha actualizado correctamente el servicio ${upServicio.name}.`,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Eliminar blog
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const delServicio = await deleteServicio(id);
        res.status(200).json({
            id: delServicio._id,
            msj: `Se ha eliminado correctamente el servicio ${delServicio.name}.`,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/deshabilitar/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const serviceDes = await deshabilitarService({ id });
        res.status(200).json({
            id: serviceDes._id,
            name: serviceDes.name,
            msj: `Se ha deshabilitado el servicio ${serviceDes.name} correctamente.`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put("/habilitar/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const serviceDes = await habilitarService({ id });
        res.status(200).json({
            id: serviceDes._id,
            name: serviceDes.name,
            msj: `Se ha habilitado el servicio ${serviceDes.name} correctamente.`
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;