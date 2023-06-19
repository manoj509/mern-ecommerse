const { placeOrder, allOrders, ordersHistory, distroyOrders, initiatePayment, verifyPayment } = require("../controllers/orderController")

const router = require("express").Router()

router
    .post("/place", placeOrder)
    .get("/", allOrders)
    .get("/order-history", ordersHistory)
    .post("/initiate-payment", initiatePayment)
    .post("/verify-payment", verifyPayment)
    .delete("/destroy", distroyOrders)

module.exports = router









