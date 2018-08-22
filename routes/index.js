var express = require("express");
var router = express.Router();

var etherScan = require("../controllers/etherScanController.js");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/get-transactions", etherScan.getTransaction);
router.post("/add-review", etherScan.addReviews);

module.exports = router;
