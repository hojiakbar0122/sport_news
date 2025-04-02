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
const tagsRoute = require("./tags.routes");
const NewsTagsRoute = require("./news_tags.routes");
const notificationsRoute = require("./notifications.routes");
const authorsRoute = require("./authors.routes");
const otpRoute = require("./otp.routes");

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
router.use("/tags", tagsRoute);
router.use("/newsTags", NewsTagsRoute);
router.use("/notifications", notificationsRoute);
router.use("/authors", authorsRoute);
router.use("/otp", otpRoute);

module.exports = router;

