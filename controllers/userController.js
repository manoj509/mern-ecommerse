const User = require("./../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const sendEmail = require("../utils/email")
exports.register = async(req, res) => {
    try {
        const { password, email } = req.body
        const found = await User.findOne({ email })
        if (found) {
            return res.status(400).json({
                message: "Email Already Registered With Us"
            })
        }
        const hashPass = bcrypt.hashSync(password, 10)
        const result = await User.create({
            ...req.body,
            password: hashPass,
            role: "user"
        })
        res.json({
            message: "User Register Succes"
        })
    } catch (error) {
        console.log("userController.js => register")
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.readUsers = async(req, res) => {
    try {

        const result = await User.find()
        res.json({
            message: "All Users Fetch Succes",
            result
        })
    } catch (error) {
        console.log("userController.js => readUsers")
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.readUserProfile = async(req, res) => {
    try {
        const { userId } = req.params
        const result = await User.findById(userId)
        res.json({
            message: " User Profile Fetch Succes",
            result
        })
    } catch (error) {
        console.log("userController.js => readUserProfile")
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.updateUser = async(req, res) => {
    try {
        console.log("update madhe ala")
        const { userId } = req.params
        console.log(userId)
        const result = await User.findByIdAndUpdate(userId, req.body, { new: true })
        res.json({
            message: "User Update  Success",
            result
        })
    } catch (error) {
        console.log("userController.js => updateUser")
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.deleteUser = async(req, res) => {
    try {
        const { userId } = req.params
        const result = await User.findByIdAndDelete(userId)
        res.json({
            message: "User delete  Success",
            result
        })
    } catch (error) {
        console.log("userController.js => deleteUser")
        console.log(error)
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.destroyUsers = async(req, res) => {
    try {
        const result = await User.deleteMany()
        res.json({
            message: "User destroy  Success",
            result
        })
    } catch (error) {
        console.log("userController.js => destroyUsers")
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.login = async(req, res) => {
    try {
        console.log("loginMadhe ala")
        const { email, password } = req.body
        const found = await User.findOne({ email })

        if (!found) {
            return res.status(400).json({
                message: "Email Not Registred With Us "
            })
        }
        const verify = await bcrypt.compare(password, found.password)
        if (!verify) {
            return res.status(400).json({
                message: "Password Do Not Match"
            })
        }
        const token = jwt.sign({ userId: found._id, role: found.role }, process.env.JWT_KEY)
        res.cookie("token", token)
        const addr = {
            house: found.address.house || "",
            street: found.address.street || "",
            city: found.address.city || "",
            pin: found.address.pin || "",
        }
        res.json({
            message: "Login Success",
            result: {
                name: found.name,
                email: found.email,
                role: found.role,
                id : found._id,
                address: addr
            }
        })
    } catch (error) {
        console.log("userController.js => destroyUsers")
         res.json({
            message: "Error " + error
        })
    }
}
exports.continueWithGoogle = async(req, res) => {
    try {
        if (!req.body.tokenId) {
            return res.status(400).json({
                message: "Please Provide  Token"
            })
        }
        const gc = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const { payload: { email, name, picture } } = await gc.verifyIdToken({ idToken: req.body.tokenId })
        const result = await User.findOne({ email })
        if (result) {

            const token = jwt.sign({
                userId: result._id,
                name,
                email,
                role: result.role
            }, process.env.JWT_KEY)
            res.cookie("token", token)

            const addr = {
                house: result.address.house || "",
                street: result.address.street || "",
                city: result.address.city || "",
                pin: result.address.pin || "",
            }
            res.json({
                message: "Login Success",
                result: {
                    name,
                    email,
                    role: result.role,
                    address: addr
                }
            })

        } else {
            const result = await User.create({
                name,
                email,
                profile: picture
            })

            const token = jwt.sign({
                name,
                email,
                role: result.role
            }, process.env.JWT_KEY)
            res.cookie("token", token)
            res.json({
                message: "Register Success",
                result: {
                    name,
                    email,
                    role: result.role
                }
            })
        }


    } catch (error) {
        console.log("userController.js => continueWithGoogle")
        console.log(error)
        res.status(400).json({
            message: "Error " + error
        })
    }
}
exports.forgetPassword = async(req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                message: "please provide email"
            })
        }

        const result = await User.findOne({ email: req.body.email })
        if (!result) {
            return res.status(400).json({
                message: "Email is not registered with us"
            })
        }



        const message = `
        <h1>Dear ${result.name},</h1>
        <p>We have received a request to reset the password for your account associated with SKILLHUB E Commerce . We understand the importance of protecting your personal information and take all necessary steps to ensure that your account is secure.</p>

        <p>To reset your password, please click on the following link: </p>

        <a href="http://localhost:5173/reset-password/${result._id}">Click Here To Reset Password</a>

        <p>If you did not initiate this password reset request, please ignore this email. If you continue to receive such emails, please contact our support team immediately.</p>

        <p>Thank you for your prompt attention to this matter.</p>

        <p>Sincerely,</p>

        <p>SKILLHUB Team</p>
        `
        sendEmail({
            to: result.email,
            subject: "Reset Password",
            html: message,
            text: message
        })

        res.json({
            message: "Instruction Send to Email Success"
        })

    } catch (error) {
        console.log("userController.js => continueWithGoogle")
        console.log(error)
        res.status(400).json({
            message: "Error " + error
        })
    }
}


exports.resetPassword = async(req, res) => {
    try {
        const { uId } = req.params
        const found = await User.findOne({ _id: uId })
        if (!found) {
            return res.status(400).json({
                message: "Invalid User Id"
            })
        }
        const hashPass = await bcrypt.hashSync(req.body.password, 10)
        const result = await User.findByIdAndUpdate(uId, {
            password: hashPass
        })

        res.json({ message: "Reset Success" })

    } catch (error) {
        console.log("userController.js => continueWithGoogle")
        console.log(error)
        res.status(400).json({
            message: "Error " + error
        })
    }
}