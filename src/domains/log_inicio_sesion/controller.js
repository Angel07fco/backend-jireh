const moment = require("moment");
const LogSession = require("./model");

const createdLog = async (data) => {
    try {
        const { usuario, ip, navegador, accion, tipo, descripcion } = data;

        const newCreatedLog = new LogSession({
            usuario,
            ip,
            navegador,
            tipo,
            accion,
            descripcion,
            isLogDate: moment().format('DD MM YYYY, hh:mm:ss a')
        });
        const createdLogg = await newCreatedLog.save();

        return createdLogg;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createdLog };