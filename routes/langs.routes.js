const router = require("express").Router()
const {
  addNewLang,
  getLangById,
  getAllLang,
  updateLangById,
  deleteLangById,
} = require("../controllers/langs.controller");



router.post("/", addNewLang)
router.get("/", getAllLang)
router.get("/:id", getLangById)
router.put("/:id", updateLangById)
router.delete("/:id", deleteLangById)

module.exports = router