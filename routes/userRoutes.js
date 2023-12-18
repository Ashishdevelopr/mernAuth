const express = require("express")
const { signupUser, loginUser, verifyToken, getUser } = require("../controller/userController")

const router = express.Router()

router.post("/signup", signupUser)

router.post("/login", loginUser)

router.get("/user", verifyToken, getUser)

module.exports = router