const router = require("express").Router()

const {
  addNewUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
} = require("../controllers/users.controller");

router.post("/", addNewUser)
router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", updateUserById)
router.delete("/:id", deleteUserById)

module.exports = router