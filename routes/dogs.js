const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("dogs home page");
});

router.get("/dog/:id", (req, res) => {
  res.send(`Individual dog ${req.params.id}`);
});

router.get("*", (req, res) => {
  res.send("404 page");
});

module.exports = router;
