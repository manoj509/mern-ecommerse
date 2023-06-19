const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is required "]
    },
    desc: {
        type: String,
        required: [true, "Product Desc is required "]
    },
    stock: {
        type: Number,
        required: [true, "Product Stock is required "]
    },
    price: {
        type: Number,
        required: [true, "Product Price is required "]
    },
    images: {
        type: [String],
        required: [true, "Product Image is required "]
    },
    publish: {
        type: Boolean,
        default: true
    },
    available: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

module.exports = mongoose.model("product", productSchema)