const express = require("express");
const app = express();
const dogs = require("./routes/dogs");
const bodyParser = require("body-parser");

// view engine
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serving static content
// app.use(express.static('public'));

app.get("/", function (req, res) {
  res.render("home_view", {
    title: "Dynamic view",
    content: "Dynamic view content",
  });
});

app.get("/form", function (req, res) {
  res.render("form_view", {
    title: "Form title",
  });
});

app.post("/form", function (req, res) {
  console.log(req.body);
  res.render("success_view");
});

app.get("/about", function (req, res) {
  res.render("about_view");
});

app.use("/dogs", dogs);

app.listen(3000);
