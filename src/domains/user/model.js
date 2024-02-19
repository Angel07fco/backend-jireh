const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user: { type: String, require: true },
    email: { type: String, require: true, trim: true, unique: true },
    phone: { type: String, require: true, trim: true },
    password: { type: String, require: true },
    userStatus: { type: String, trim: true, default: null },
    accountStatus: { type: String, trim: true, default: null },
    rol: { type: String, default: "usuario" },
    accountCreated : { type: String },
    isLogginDate: { type: String, default: null },
    token: { type: String, default: null },
    expiratedTokenDate : { type: String, default: null },
    verified: { type: Boolean, default: false },
    isLogginIntented: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;