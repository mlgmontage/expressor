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
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

// database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/expressor", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Database Schema
const namesSchema = mongoose.Schema({
  name: String,
});

// const authors = mongoose.Schema({
//   name: String,
// });

// const books = mongoose.Schema({
//   name: String,
//   authorId: String,
// });

const Name = mongoose.model("names", namesSchema);
// const Author = mongoose.model("authors", authors);
// const Books = mongoose.model("books", books);

const author = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secters", authorId: 1 },
  { id: 2, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 3, name: "The Two Towers", authorId: 3 },
  { id: 4, name: "Beyond the Shadows", authorId: 2 },
];

// graphQL Schema

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This is books",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return author.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This is authors",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "helloworld",
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => "Hello, world",
      },
      sample: {
        type: GraphQLInt,
        resolve: () => 420,
      },
      books: {
        type: new GraphQLList(BookType),
        description: "List of books",
        resolve: () => books,
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

app.get("/:id", function (req, res) {
  Name.find({ _id: req.params.id }, function (err, response) {
    if (err) return;
    console.log(response);
    res.render("name_view", {
      title: "Dynamic view",
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
