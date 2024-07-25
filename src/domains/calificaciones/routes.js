const express = require("express");
const router = express.Router();
const { createCalificacionCita, getCalificacionesCitas, getCalificacionCitaById, updateCalificacionCita } = require("./controller");

// Crear nueva calificación de cita
router.post("/", async (req, res) => {
    try {
        const calificacionCita = await createCalificacionCita(req.body);
        res.status(201).json(calificacionCita);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Obtener todas las calificaciones de citas
router.get("/", async (req, res) => {
    try {
        const calificacionesCitas = await getCalificacionesCitas();
        const formattedResponse = calificacionesCitas.map(calificacion => ({
            Cliente_ID: calificacion.usuario._id,
            Fecha_Visita: calificacion.cita.fecha,
            Tipo_Servicio: calificacion.servicio.name,
            Tiempo_Espera: calificacion.tiempoEspera,
            Duración_Atención: calificacion.duracion,
            Costo_Servicio: calificacion.costo,
            Personal_Atención: calificacion.medico._id,
            Calidad_Atención: calificacion.calidadAtencion,
            Instalaciones: calificacion.instalaciones,
            Comunicación: calificacion.comunicacion,
            Facilidad_Pago: calificacion.facilidadPago,
            Experiencia_Cliente: calificacion.experienciaCliente,
            Recomendaciones: calificacion.recomendaciones,
            Satisfaccion_Cliente: calificacion.satisfaccionCliente,
        }));
        res.status(200).json(formattedResponse);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Obtener calificación de cita por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const calificacionCita = await getCalificacionCitaById(id);
        res.status(200).json(calificacionCita);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Actualizar calificación de cita por ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCalificacionCita = await updateCalificacionCita(id, req.body);
        res.status(200).json(updatedCalificacionCita);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;