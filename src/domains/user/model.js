const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;