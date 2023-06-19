const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    paid: {
        type: Boolean,
        required: true
    },
    status: {
        type: String,
        enum: ["placed", "dispatch", "out", "delivered", "cancel"],
        default: "placed"
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "product",
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]
    }

}, { timestamps: true })

module.exports = mongoose.model("order", orderSchema)