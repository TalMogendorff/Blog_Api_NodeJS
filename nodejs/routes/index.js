var express = require("express");
const { authorize } = require("../middlewares/auth");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/help", authorize, (req, res, next) => {
  res.render("layout", { title: "help" });
});

module.exports = router;
