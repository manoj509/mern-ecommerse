const { readProducts, readProductDetail, updateProduct, destroyProducts, deleteProduct, addProduct } = require("../controllers/productController")
const router = require("express").Router()

router
    .get("/", readProducts)
    .post("/add-product", addProduct)
    .get("/:productId", readProductDetail)
    .put("/:productId", updateProduct)
    .delete("/destroy", destroyProducts)
    .delete("/:productId", deleteProduct)


module.exports = router