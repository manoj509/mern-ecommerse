const {
    readUsers,
    readUserProfile,
    register,
    updateUser,
    deleteUser,
    destroyUsers,
    login,
    continueWithGoogle,
    forgetPassword,
    resetPassword } = require("../controllers/userController")

const router = require("express").Router()

router
    .get("/", readUsers)
    .get("/profile/:userId", readUserProfile)
    .post("/register", register)
    .put("/:userId", updateUser)
    .delete("/destroy", destroyUsers)
    .delete("/:userId", deleteUser)
    .post("/login", login)
    .post("/continue-with-google", continueWithGoogle)
    .post("/forget-password", forgetPassword)
    .post("/reset-password/:uId", resetPassword)


module.exports = router