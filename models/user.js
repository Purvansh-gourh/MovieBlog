var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    username: String,
    password: String,
    phone: { type: String, required: true },
    google: {
        id: String,
        token: String,
        name: String,
        email: String,
        photo: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        photo: String
    },
    resetToken: String,
    resetExpire: Number
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
