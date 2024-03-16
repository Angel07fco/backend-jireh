const Service = require("./model");

const getAllServices = async () => {
    try {
        const services = await Service.find({});
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
        const { name, img, description, price } = data;

        const newService = new Service({
            name,
            img,
            description,
            price
        });
        const createdService = await newService.save();
        return createdService;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createNewService, getAllServices, getServiceById };