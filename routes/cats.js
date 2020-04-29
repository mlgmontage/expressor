const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("cats router home");
});

router.get("/:id([0-9]{3})", function (req, res) {
  res.send(`individual cat ${req.params.id}`);
});

router.get("*", function (req, res) {
  res.send("404 page");
});

module.exports = router;
