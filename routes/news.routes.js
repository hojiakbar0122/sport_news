const router = require("express").Router()

const {
  addNewNews,
  getNewsById,
  getAllNews,
  updateNewsById,
  deleteNewsById,
} = require("../controllers/news.controller");

router.post("/", addNewNews)
router.get("/", getAllNews)
router.get("/:id", getNewsById)
router.put("/:id", updateNewsById)
router.delete("/:id", deleteNewsById)

module.exports = router