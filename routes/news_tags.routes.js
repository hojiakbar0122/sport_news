const { addNewNewsTag, getAllNewsTags, getNewsTagById, updateNewsTagById, deleteNewsTagById } = require("../controllers/news_tags.controller")

const router = require("express").Router()

router.post("/", addNewNewsTag)
router.get("/", getAllNewsTags)
router.get("/:id", getNewsTagById)
router.put("/:id", updateNewsTagById)
router.delete("/:id", deleteNewsTagById)

module.exports = router