const router = require("express").Router()
const { addNewNewsWithLang, getAllNewsWithLang, getNewsWithLangById, updateNewsWithLangById, deleteNewsWithLangById } = require("../controllers/newsWithLangs .controller");

router.post("/", addNewNewsWithLang)
router.get("/", getAllNewsWithLang)
router.get("/:id", getNewsWithLangById)
router.put("/:id", updateNewsWithLangById)
router.delete("/:id", deleteNewsWithLangById)

module.exports = router