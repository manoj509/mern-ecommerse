const { upload } = require("../utils/upload")
const Product = require("./../models/Product")
const asyncHandler = require("express-async-handler")
exports.addProduct = asyncHandler(async(req, res) => {
    upload(req, res, async err => {
        if (err) {
            return res.status(400).json({ message: "Multer Error" + err, })
        }
        let imageURL = []
        for (let i = 0; i < req.files.length; i++) {
            const src = `${process.env.HOST}/${req.files[i].filename}`
            imageURL.push(src)
        }
        const result = await Product.create({
            name: req.body.name,
            stock: req.body.stock,
            price: req.body.price,
            desc: req.body.desc,
            images: imageURL,
        })
        res.json({ message: "Prodcut Add Sucess" })
    })
})
exports.readProducts = async(req, res) => {
    try {
        const result = await Product.find()
        res.json({ message: "Prodcut Read Sucess", result })
    } catch (error) {
        console.log("productController => readProduct")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.readProductDetail = async(req, res) => {
    try {
        const { productId } = req.params

        const result = await Product.findById(productId)
        if (!result) {
            return res.status(400).json({ message: `Invalid Product Id` })
        }
        res.json({ message: "Single Prodcut Read Sucess", result })
    } catch (error) {
        console.log("productController => readProductDetail")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.updateProduct = async(req, res) => {
    try {
        // const result = await Product.find()
        res.json({ message: " Product Update Sucess" })
    } catch (error) {
        console.log("productController => updateProduct")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.deleteProduct = async(req, res) => {
    try {
        // const result = await Product.find()
        res.json({ message: " Product Delete Sucess" })
    } catch (error) {
        console.log("productController => deleteProduct")
        res.status(400).json({ message: `Error ${error}` })
    }
}
exports.destroyProducts = async(req, res) => {
    try {
        const result = await Product.deleteMany()
        res.json({ message: " Products Destroy Sucess" })
    } catch (error) {
        console.log("productController => destroyProducts")
        res.status(400).json({ message: `Error ${error}` })
    }
}