const Service = require("./model");
const Cita = require("../citas/model")

const getAllServices = async () => {
    try {
        const services = await Service.find({ estado: "disponible" });
        return services;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllServicesAdmin = async () => {
    try {
        const services = await Service.find();
        return services;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getServiceById = async (serviceId) => {
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            throw new Error("Servicio no encontrado");
        }
        return service;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createNewService = async (data) => {
    try {
        const { name, img, description, icono } = data;

        const newService = new Service({
            name,
            img,
            description,
            icono
        });
        const createdService = await newService.save();
        return createdService;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Editar una imagen en la galería
const updateServicio = async (id, data) => {
    try {
        const updateServicio = await Service.findByIdAndUpdate(id, data, { new: true });
        if (!updateServicio) {
            throw Error("Servicio no encontrado");
        }
        return updateServicio;
    } catch (error) {
        throw error;
    }
};

// Eliminar un servicio
const deleteServicio = async (id) => {
    try {
        // Verificar si existen citas asociadas con el servicio
        const existingCitas = await Cita.find({ servicio: id });
        if (existingCitas.length > 0) {
            throw new Error("No se puede eliminar el servicio porque hay citas agendadas con este servicio.");
        }

        const deleteSer = await Service.findByIdAndDelete(id);
        if (!deleteSer) {
            throw new Error("Servicio no encontrado");
        }
        return deleteSer;
    } catch (error) {
        throw error;
    }
};

const deshabilitarService = async (data) => {
    try {
        const { id } = data;

        const service = await Service.findByIdAndUpdate(
            id,
            { estado: 'indisponible' },
            { new: true }
        );

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        return service;
    } catch (error) {
        throw new Error(error.message);
    }
};

const habilitarService = async (data) => {
    try {
        const { id } = data;

        const service = await Service.findByIdAndUpdate(
            id,
            { estado: 'disponible' },
            { new: true }
        );

        if (!service) {
            throw new Error("Servicio no encontrado");
        }

        return service;
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = { createNewService, getAllServicesAdmin, getAllServices, getServiceById, updateServicio, deleteServicio, deshabilitarService, habilitarService };