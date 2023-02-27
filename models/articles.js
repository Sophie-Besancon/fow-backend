const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  name: String,
  country: {type: mongoose.Schema.Types.ObjectId, ref: "country"},
  price: Number,
  category: {type: mongoose.Schema.Types.ObjectId, ref: "categories"},
  note: Number,
  description: String,
  stock: Number,
  image: Array,
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;