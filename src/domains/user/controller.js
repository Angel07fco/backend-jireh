const User = require("./model");
const { hashData, verifyHashedData } = require("./../../utils/hashData");
const createToken = require("./../../utils/createToken");

const authenticateUser = async (data) => {
    try {
        const { email, password } = data;

        const fetchedUser = await User.findOne({ email });

        if (!fetchedUser) {
            throw Error("Invalid credentials entered!");
        }
        if (!fetchedUser.verified) {
            throw Error("Email hasn´t been verified yet. Check your inbox.")
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
            throw Error("Invalid password entered!");
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
        const { name, email, password } = data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw Error("User with the provided email already exists");
        }

        const hashedPassword = await hashData(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw error;
    }
};

module.exports = { createNewUser, authenticateUser };