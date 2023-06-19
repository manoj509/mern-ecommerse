const Order = require("../models/Order")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const { v4: uuid } = require("uuid")
const Razorpay = require("razorpay")
const crypto = require("crypto")
exports.placeOrder = async(req, res) => {
    console.log("callll place order component")
    try {
        if (!req.cookies) {
            return res.status(401).json({ message: `Inavlid Request` })
        }
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({ message: `Please Provide Token` })
        }
        const { userId } = jwt.verify(token, process.env.JWT_KEY)
        const result = await Order.create({
            userId,
            ...req.body
        })
        res.json({ message: `Order Placce`, result })
    } catch (error) {
        console.log("orderController => placeOrder")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.allOrders = async(req, res) => {
    try {
        const result = await Order.find()
            .populate("userId", "name email -_id")
            .populate("products.product")
        res.json({ message: `Get All Order Success`, result })
    } catch (error) {
        console.log("orderController => allOrders")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.ordersHistory = async(req, res) => {
    try {
        if (!req.cookies) {
            return res.status(401).json({ message: `Inavlid Request` })
        }
        const { token } = req.cookies
        if (!token) {
            return res.status(401).json({ message: `Please Provide Token` })
        }
        const { userId } = jwt.verify(token, process.env.JWT_KEY)

        const result = await Order.find({ userId })
        res.json({ message: `User Order History Success`, result })
    } catch (error) {
        console.log("orderController => ordersHistory")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.distroyOrders = async(req, res) => {
    try {
        const result = await Order.deleteMany()
        res.json({ message: `Order Destroy Success`, result })
    } catch (error) {
        console.log("orderController => ordersHistory")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.initiatePayment = asyncHandler(async(req, res) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET,
    })
    instance.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: uuid()
    }, (err, order) => {
        if (err) {
            return res.status(400).json({
                message: "Order Fail" + err
            })
        }
        res.json({
            message: "Payment Initiated",
            result: order.id
        })
    })
})

exports.verifyPayment = asyncHandler(async(req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const key = `${razorpay_order_id}|${razorpay_payment_id}`
    const singnature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(key.toString())
        .digest("hex")

        if (singnature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid Signature"
            })
        }
        // console.log(razorpay_signature);

    if (!req.cookies) {
        return res.status(401).json({ message: `Inavlid Request` })
    }
    const { token } = req.cookies
    if (!token) {
        return res.status(401).json({ message: `Please Provide Token` })
    }
    const { userId } = jwt.verify(token, process.env.JWT_KEY)
    const result = await Order.create({
        userId,
        products: req.body.cartItems,
        paid: true
    })
    res.json({ message: `Order Placed Successssssssss`, result })
})