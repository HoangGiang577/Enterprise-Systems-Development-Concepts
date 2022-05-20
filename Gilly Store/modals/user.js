const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Address: String,
    Phone: String,
    Password: String,
    userGroup: Number,
    Status: Number,
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, 8);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model('User',userSchema);