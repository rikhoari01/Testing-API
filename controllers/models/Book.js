let mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
      title: { type: String, required: true },
      author: { type: String, required: true },
      year: { type: Number, required: true },
      publisher: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model("Book", bookSchema);