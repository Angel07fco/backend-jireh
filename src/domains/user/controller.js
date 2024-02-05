const User = require("./model");
const { hashData } = require("./../../utils/hashData");

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

module.exports = { createNewUser };