let express = require("express");
let mongoose = require("mongoose");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let config = require("config");

let app = express();
let port = 8080;

let book = require("./controllers/routes/book");

mongoose.connect(config.DBHost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

if (config.util.getEnv("NODE_ENV") != "test") {
  app.use(morgan("combined"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

app.get("/", (req, res) =>
  res.json({
    message: "Selamat datang di Gramedia Pustaka",
  })
);

app.route("/book").get(book.getBooks).post(book.postsBook);
app
  .route("/book/:id")
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app;
