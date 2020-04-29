const express = require("express");
const app = express();
const dogs = require("./routes/dogs");
const bodyParser = require("body-parser");
// graphq
const expressGraphQL = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

// database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/expressor", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Schema
const namesSchema = mongoose.Schema({
  name: String,
});

const Name = mongoose.model("names", namesSchema);

// graphQL Schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "helloworld",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "Hello, world",
      },
    }),
  }),
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

// view engine
app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serving static content
// app.use(express.static('public'));

app.get("/", function (req, res) {
  Name.find({}, function (err, response) {
    if (err) return;
    res.render("home_view", {
      title: "Dynamic view",
      content: "Dynamic view content",
      data: response,
    });
  });
});

app.get("/form", function (req, res) {
  res.render("form_view", {
    title: "Form title",
  });
});

app.post("/form", function (req, res) {
  console.log(req.body);
  // saving to database
  const newName = new Name({
    name: req.body.name,
  });

  newName.save(function (err, Name) {
    if (!err) {
      res.render("success_view", req.body);
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about_view");
});

app.use("/dogs", dogs);

app.listen(3000);
