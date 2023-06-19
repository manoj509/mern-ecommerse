const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
require("dotenv").config({ path: "./.env" })
connectDB()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))
app.use(cors({
    origin: "https://mern-ecommerse-production.up.railway.app",
    credentials: true
}))
app.use("/api/user", require("./routes/userRoutes"))
app.use("/api/products", require("./routes/productRoutes"))
app.use("/api/orders", require("./routes/orderRoutes"))

app.use("*", (req , res , err ) => {
    console.log(err)
    res.status(400).json({
        message: "Something went wrong"
    })
})
mongoose.connection.once("open", e => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT || 5000, err => {
        err
            ?
            console.log(`UNABLE TO START ${err}`) :
            console.log(`http://localhost:${process.env.PORT || 5000}`)
    })
})
mongoose.connection.on("error", err => console.log(`MONGO ERROR ${err}`))