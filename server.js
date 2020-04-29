const express = require("express");
const app = express();
const cats = require("./routes/cats");

// Third party middleware
// app.use(bodyParser.json())

// app.method(path, handler)
app.get("/hello", (req, res) => {
  res.send("my first route");
});

app.use("/cats", cats);

app.listen(3000);
