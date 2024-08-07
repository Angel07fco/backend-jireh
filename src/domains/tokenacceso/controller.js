const TokenAcceso = require("./model");
const { getUserById } = require("../user/controller");
const generateOTP = require("../../utils/generateOTP");

const verifyTokenAcceso = async ({ token, tToken }) => {
    try {
        if (!token) {
            throw new Error("Proporcione su Token de Acceso.");
        }

        // Buscamos el registro de ese token
        const matchedTokenAccesoRecord = await TokenAcceso.findOne({ token });

        // Verificamos que el token existe
        if (!matchedTokenAccesoRecord) {
            throw new Error("No se han encontrado registros de ese Token de Acceso.");
        }

        // Si existe obtenemos el tipo de token y el tiempo de expiración
        const { tipoToken, expiresAt, tokenUsuario } = matchedTokenAccesoRecord;

        if (tipoToken !== tToken) {
            throw new Error("El token proporcionado no es válido para este dispositivo.");
        }

        if (expiresAt < Date.now()) {
            await TokenAcceso.deleteOne({ token });
            throw new Error("El token ha caducado. Solicite uno nuevo.");
        }

        await deleteTokenAcceso(token);

        const infoUser = await getUserById(tokenUsuario);

        return infoUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const generateTokenAcceso = async ({ tokenUsuario, tipo }) => {
    try {
        // Limpiar cualquier token generado anteriormente
        await TokenAcceso.deleteOne({ tokenUsuario });

        // Generando nuevo token
        const generatedTokenAcceso = await generateOTP();

        // Guardar nuevo token
        const newTokenUsuario = new TokenAcceso({
            tokenUsuario,
            token: generatedTokenAcceso,
            tipoToken: tipo,
            createAt: Date.now(),
            expiresAt: Date.now() + 300000,
        });

        const createdTokenUsuario = await newTokenUsuario.save();
        return createdTokenUsuario;
    } catch (error) {
        throw error;
    }
};

const deleteTokenAcceso = async (token) => {
    try {
        await TokenAcceso.deleteOne({ token });
    } catch (error) {
        throw error;
    }
};

module.exports = { generateTokenAcceso, verifyTokenAcceso, deleteTokenAcceso };