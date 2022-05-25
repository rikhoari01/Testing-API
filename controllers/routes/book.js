let mongoose = require("mongoose");
let Book = require("../models/Book");

function getBooks(req, res) {
      let query = Book.find({});
      query.exec((err, books) => {
            if(err) res.send(err);
            res.json(books);
      })
}

function postsBook(req, res) {
      const newBook = new Book(req.body);
      newBook.save((err, book) => {
            if(err){
                  res.send(err);
            }
            else {
                  res.json({ message: "Book successfully added!", book });
            }
      });
}

function getBook(req, res) {
      Book.findById(req.params.id, (err, book) => {
            if(err) res.send(err);
            res.json(book);
      })
}

function deleteBook(req, res) {
      Book.findByIdAndRemove({ _id: req.params.id}, (err, result) => {
            res.json({ message: "Book successfully deleted!", result })
      })
}

function updateBook(req, res) {
      Book.findById({ _id: req.params.id }, (err, book) => {
            if(err) res.send(err);
            Object.assign(book, req.body).save((err, book) => {
                  if(err) res.send(err);
                  res.json({ message: "Book updated!", book });
            });
      });
}

module.exports = { getBooks, postsBook, getBook, deleteBook, updateBook };