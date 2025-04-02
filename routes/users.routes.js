const router = require("express").Router()

const {
  addNewUser,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  refreshTokenUser,
} = require("../controllers/users.controller");

router.post("/", addNewUser)
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenUser);

router.get("/", getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", updateUserById)
router.delete("/:id", deleteUserById)

module.exports = router