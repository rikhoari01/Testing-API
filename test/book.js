process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");

let Book = require("../controllers/models/Book");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("Books", () => {
  beforeEach((done) => {
    Book.deleteMany({}, (err) => {
      done();
    });
  });
  describe("/GET book", () => {
    it("it should GET all the books", (done) => {
      chai
        .request(server)
        .get("/book")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  describe("/POST book", () => {
    it("it should not POST a book without year field", (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        publisher: "Gramedia Pustaka"
      };
      chai
        .request(server)
        .post("/book")
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("year");
          res.body.errors.year.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should POST a book ", (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
        publisher: "Gramedia Pustaka"
      };
      chai
        .request(server)
        .post("/book")
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Book successfully added!");
          res.body.book.should.have.property("title");
          res.body.book.should.have.property("author");
          res.body.book.should.have.property("year");
          res.body.book.should.have.property("publisher");
          done();
        });
    });
  });
  describe("/GET/:id book", () => {
    it("it should GET a book by the given id", (done) => {
      let book = new Book({
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954,
        publisher: "Gramedia Pustaka"
      });
      book.save((err, book) => {
        chai
          .request(server)
          .get("/book/" + book.id)
          .send(book)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("title");
            res.body.should.have.property("author");
            res.body.should.have.property("year");
            res.body.should.have.property("publisher");
            res.body.should.have.property("_id").eql(book.id);
            done();
          });
      });
    });
  });
  describe("/PUT/:id book", () => {
    it("it should UPDATE a book given the id", (done) => {
      let book = new Book({
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        year: 1948,
        publisher: "Gramedia Pustaka"
      });
      book.save((err, book) => {
        chai
          .request(server)
          .put("/book/" + book.id)
          .send({
            title: "The Chronicles of Narnia",
            author: "C.S. Lewis",
            year: 1950,
            publisher: "Gramedia Pustaka"
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Book updated!");
            res.body.book.should.have.property("year").eql(1950);
            done();
          });
      });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id book", () => {
    it("it should DELETE a book given the id", (done) => {
      let book = new Book({
        title: "The Chronicles of Narnia",
        author: "C.S. Lewis",
        year: 1948,
        publisher: "Gramedia Pustaka"
      });
      book.save((err, book) => {
        chai
          .request(server)
          .delete("/book/" + book.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("Book successfully deleted!");
            done();
          });
      });
    });
  });
});
