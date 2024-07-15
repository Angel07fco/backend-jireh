const TokenAcceso = require("./model");
const createTokenPassword = require("../../utils/createTokenPassword");
const { getUserById } = require("../user/controller");

const verifyTokenAcceso = async ({ token, tToken }) => {
    try {
        if (!(token)) {
            throw Error("Proporcione su Token de Acceso");
        }

        console.log("Tipo de token: " + tToken)

        // buscamos el registro de ese token
        const matchedTokenAccesoRecord = await TokenAcceso.findOne({ token });

        // Verificamos que el token existe
        if (!matchedTokenAccesoRecord) {
            throw Error("No se han encontrado registros de ese Token de Acceso.");
        }

        // Si existe obtenemos el tipo de token y el tiempo de expiración
        const { tipoToken, expiresAt, tokenUsuario } = matchedTokenAccesoRecord;
        console.log(tipoToken)

        if (tipoToken !== tToken) {
            throw Error("El token proporcionado no es valido para este dispositivo.");
        }

        if (expiresAt < Date.now()) {
            await TokenAcceso.deleteOne({ token });
            throw Error("El token ha caducado. Solicite uno nuevo.");
        }

        await deleteTokenAcceso(token);

        const infoUser = await getUserById(tokenUsuario);

        return infoUser;
    } catch (error) {
        throw error;
    }
};

const generateTokenAcceso = async ({ tokenUsuario, tipo }) => {
    try {
        // Limpiar cualquier token generado anteriormente
        await TokenAcceso.deleteOne({ tokenUsuario });

        // Generando nuevo token
        const generatedTokenAcceso = await createTokenPassword();

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