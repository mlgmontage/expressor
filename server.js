const express = require("express");
const app = express();
const dogs = require("./routes/dogs");

// view engine
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", function (req, res) {
  res.render("home_view");
});

app.get("/about", function (req, res) {
  res.render("about_view");
});

app.use("/dogs", dogs);

app.listen(3000);
