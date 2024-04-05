const express = require("express");
const router = express.Router();
const { createdLog } = require("./controller");

router.post("/", async(req, res) => {
    let { usuario, tipo, accion, descripcion } = req.body;
    const ip = req.ip;
    const navegador = req.headers['user-agent'];

    try {
        if (!(usuario && ip && navegador && accion)) {
            throw new Error("Campos de entrada vacíos!");
        } else {
            const createNewLog = await createdLog({
                usuario,
                ip,
                navegador,
                tipo,
                accion,
                descripcion
            });

            res.status(200).json({
                id: createNewLog._id,
                msj: "Se ha creado su nuevo log correctamente",
                createdAt: createNewLog.createdAt,
                updatedAt: createNewLog.updatedAt
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;