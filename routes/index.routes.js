const router = require("express").Router();

const langsRoute = require("./langs.routes");
const newsRoute = require("./news.routes");
const usersRoute = require("./users.routes");
const newsWithLangsRoute = require("./newsWithLangs.routes");
const categoriesRoute = require("./category.routes");
const mediaRoute = require("./media.routes");
const commentsRoute = require("./comments.routes");
const reportsRoute = require("./reports.routes");
const likesRoute = require("./likes.routes");
const viewsRoute = require("./views.routes");

router.use("/langs", langsRoute);
router.use("/news", newsRoute);
router.use("/users", usersRoute);
router.use("/news-with-langs", newsWithLangsRoute);
router.use("/categories", categoriesRoute);
router.use("/media", mediaRoute);
router.use("/comments", commentsRoute);
router.use("/reports", reportsRoute);
router.use("/likes", likesRoute);
router.use("/views", viewsRoute);

module.exports = router;

