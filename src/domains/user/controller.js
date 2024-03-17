const moment = require("moment");
const User = require("./model");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const createToken = require("./../../utils/createToken");
const { sendEmailAccountblocked, sendEmailStatusUserAdmin, sendVerificationOTPEmail } = require("./../email_verification/controller");

const authenticateUser = async (data) => {
    try {
        const fecha = moment().add(30, 'days').endOf('day').toDate();
        const { email, password } = data;

        const fetchedUser = await User.findOne({ email });

        if (!fetchedUser) {
            throw Error("No encontramos una cuenta vinculada con ese correo electrónico. ¿Estás registrado?");
        }

        if (!fetchedUser.verified) {
            await sendVerificationOTPEmail(email);
            throw Error("El correo electrónico aún no se ha verificado. Se ha enviado un código  a tu correo, por favor comprueba tu bandeja de entrada.")
        }

        if (fetchedUser.accountStatus === "bloqueda") {
            await sendEmailAccountblocked(email);
            await sendEmailStatusUserAdmin(email);
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
                throw Error(`La cuenta ha sido bloqueada temporalmente. Comprueba tu bandeja de entrada.`);
            }
            throw Error(`La contraseña no es valida!`);
        }

        const tokenData = { userId: fetchedUser._id, email };
        const token = await createToken(tokenData);

        await User.updateOne({ email }, {
            userStatus: "activo",
            accountStatus: "activo",
            isLogginIntented: 0,
            isLogginDate: moment().format('DD MM YYYY, hh:mm:ss a'),
            token: token,
            expiratedTokenDate: moment(fecha).format('DD MM YYYY, hh:mm:ss a')
        });

        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw error;
    }
}

const createNewUser = async (data) => {
    try {
        const { user, email, phone, password, question_secret, reply_secret } = data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Ya existe un usuario con la dirección de correo electrónico ingresada.");
        }

        const existingUserPhone = await User.findOne({ phone });
        if (existingUserPhone) {
            throw new Error("Ya existe un usuario con el teléfono ingresado.");
        }

        const hashedPassword = await hashData(password);
        const hashedReply = await hashData(reply_secret);
        const newUser = new User({
            user,
            email,
            phone,
            password: hashedPassword,
            previousPasswords: [hashedPassword],
            question_secret: question_secret,
            reply_secret: hashedReply,
            accountCreated: moment().format('DD MM YYYY, hh:mm:ss a')
        });
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
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

module.exports = { createNewUser, authenticateUser, logoutUserSession, getUserById };