var express = require("express");
var path = require("path");
var router = express.Router();

var etherScan = require("../controllers/etherScanController.js");

/* GET home page. */
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  router.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app
  router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

router.post("/get-transactions", etherScan.getTransaction);
router.post("/add-review", etherScan.addReviews);

module.exports = router;
