const moment = require("moment");
const User = require("./model");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const createToken = require("./../../utils/createToken");
const { sendEmailAccountblocked, sendEmailStatusUserAdmin, sendVerificationOTPEmail } = require("./../email_verification/controller");
const { createdLog } = require("../log_inicio_sesion/controller");
const createTokenPassword = require("../../utils/createTokenPassword");

const authenticateUser = async (data) => {
    try {
        const fecha = moment().add(30, 'days').endOf('day').toDate();
        const { email, password, ip, navegador } = data;

        const fetchedUser = await User.findOne({ email });

        let accion = "Inicio de sesión";

        if (!fetchedUser) {
            throw Error("No encontramos una cuenta vinculada con ese correo electrónico. ¿Estás registrado?");
        }

        if (!fetchedUser.verified) {
            await sendVerificationOTPEmail(email);
            await createdLog({ usuario: fetchedUser._id, ip, navegador, tipo: "1", accion, descripcion: "Hubo un inicio de sesión fallido debido que la cuenta no ha sido verificada" });
            throw Error("El correo electrónico aún no se ha verificado. Se ha enviado un código  a tu correo, por favor comprueba tu bandeja de entrada.")
        }

        if (fetchedUser.accountStatus === "bloqueda") {
            await sendEmailAccountblocked(email);
            await sendEmailStatusUserAdmin(email);
            accion = "Bloqueo de cuenta";
            await createdLog({ usuario: fetchedUser._id, ip, navegador, tipo: "4", accion, descripcion: "La cuenta ha sido bloqueada temporalmente debido a varios intentos al iniciar sesión" });
            throw Error(`La cuenta ha sido bloqueada temporalmente. Comprueba tu bandeja de entrada.`);
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            await User.updateOne({ email }, { $inc: { isLogginIntented: 1 } });
            if (fetchedUser.isLogginIntented >= 4) {
                await User.updateOne({ email }, { accountStatus: "bloqueda" } );
                await sendEmailAccountblocked(email);
                await sendEmailStatusUserAdmin(email);
                accion = "Bloqueo de cuenta";
                await createdLog({ usuario: fetchedUser._id, ip, navegador, tipo: "4", accion, descripcion: "La cuenta ha sido bloqueada temporalmente debido a varios intentos al iniciar sesión" });
                throw Error(`La cuenta ha sido bloqueada temporalmente. Comprueba tu bandeja de entrada.`);
            }
            await createdLog({ usuario: fetchedUser._id, ip, navegador, tipo: "1", accion, descripcion: "Hubo un inicio de sesión fallido debido que la contraseña es incorrecta" });
            throw Error(`La contraseña no es valida!`);
        }

        const tokenData = { userId: fetchedUser._id, email };
        const token = await createToken(tokenData);
        const tokenP = await createTokenPassword(tokenData);

        await createdLog({ usuario: fetchedUser._id, ip, navegador, tipo: "1", accion, descripcion: "Hubo un inicio de sesión correctamente" });

        await User.updateOne({ email }, {
            userStatus: "activo",
            accountStatus: "activo",
            isLogginIntented: 0,
            isLogginDate: moment().format('DD MM YYYY, hh:mm:ss a'),
            token: token,
            tokenPassword: tokenP,
            expiratedTokenDate: moment(fecha).format('DD MM YYYY, hh:mm:ss a')
        });

        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}

const createdUser = async (data) => {
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
        const newCreatedUser = new User({
            user,
            email,
            phone,
            password: hashedPassword,
            previousPasswords: [hashedPassword],
            accountCreated: moment().format('DD MM YYYY, hh:mm:ss a')
        });
        const createdUser = await newCreatedUser.save();

        return createdUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateUser = async (userId, updateData, ip, navegador) => {
    try {
        const user = await User.findById(userId);

        let accion = "Actualización de datos personales";

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        for (const [key, value] of Object.entries(updateData)) {
            user[key] = value;
        }

        await createdLog({ usuario: user._id, ip, navegador, tipo: "3", accion, descripcion: "Algunos campos fueron actualizados correctamente" });

        // Guarda los cambios en la base de datos
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        await createdLog({ usuario: user._id, ip, navegador, tipo: "3", accion, descripcion: "Hubo un error al intentar actualizar algunos campos" });
        throw new Error(error.message);
    }
};

const logoutUserSession = async (token) => {
    const user = await User.findOne({ token });
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    await User.updateOne({ token }, {
        token: null,
        expiratedTokenDate: null
    });
    return;
}

const getUserById = async (token) => {
    try {
        const user = await User.findOne({ token });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getUserByAccesoWearOs = async (accesoWearOs) => {
    try {
        const user = await User.findOne({ accesoWearOs });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getUsers = async (rol) => {
    try {
        // Si se proporciona un rol, se filtran los usuarios por ese rol
        if (rol) {
            const users = await User.find({ rol });
            return users;
        } else {
            // Si no se proporciona un rol, se devuelven todos los usuarios
            const users = await User.find();
            return users;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = { createdUser, authenticateUser, logoutUserSession, getUserById, updateUser, getUsers, getUserByAccesoWearOs };