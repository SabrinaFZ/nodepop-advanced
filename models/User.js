// Creamos modelo para usuarios

const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

userSchema.statics.hashPassword = (plainPassword) => {
    return bcrypt.hash(plainPassword, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;


