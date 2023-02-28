const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  name: String,
  price: Number,
  note: Number,
  description: String,
  stock: Number,
  image: Array,
  categoryName:String,
  countryName:String,
  continentOfCountry:String,
  flagOfContinent:String,
  FlagOfCountry:String,
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;