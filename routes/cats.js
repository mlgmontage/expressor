const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("cats router home");
});

module.exports = router;
