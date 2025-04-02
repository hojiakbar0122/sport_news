const { creatOtp, verifyOtp } = require("../controllers/otp.controller")

const router = require("express").Router()

router.post("/createotp", creatOtp)
router.post("/verifyotp", verifyOtp)

module.exports = router