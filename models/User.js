const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Required"]
    },
    email: {
        type: String,
        required: [true, "Email Is Required"]
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        min: [10, "Min 10 Digit number is required "],
        max: [10, "Max 10 Digit number is required "]
    },
    active: {
        type: Boolean,
        default: true
    },
    address: {
        house: String,
        street: String,
        city: String,
        pin: String,
    },
    profile: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, { timestamps: true })


module.exports = mongoose.model("user", userSchema)