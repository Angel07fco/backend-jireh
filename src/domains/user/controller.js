const User = require("./model");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const createToken = require("./../../utils/createToken");

const authenticateUser = async (data) => {
    try {
        const { email, password } = data;

        const fetchedUser = await User.findOne({ email });

        if (!fetchedUser) {
            throw Error("No encontramos una cuenta vinculada con ese correo electrónico. ¿Estás registrado?");
        }
        if (!fetchedUser.verified) {
            throw Error("El correo electrónico aún no se ha verificado. Comprueba tu bandeja de entrada.")
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            throw Error(`Para ${email} la contraseña no es valida!`);
        }

        const tokenData = { userId: fetchedUser._id, email };
        const token = await createToken(tokenData);

        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}

const createNewUser = async (data) => {
    try {
        const { user, email, phone, password } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Ya existe un usuario con la dirección de correo electrónico ingresada.");
        }

        const existingUserPhone = await User.findOne({ phone });
        if (existingUserPhone) {
            throw new Error("Ya existe un usuario con el teléfono ingresado.");
        }

        const hashedPassword = await hashData(password);
        const newUser = new User({
            user,
            email,
            phone,
            password: hashedPassword,
        });
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw new Error(error.message); // Reenvía el error para manejarlo en la función signup
    }
};

module.exports = { createNewUser, authenticateUser };