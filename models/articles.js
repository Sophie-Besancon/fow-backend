const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  total: Number,
  shippingFees: Number,
  purchaseDate: Date,
  user: String,
  isPaid: Boolean,
  articles: [{type: mongoose.Schema.Types.ObjectId, ref: "articles"}],
});

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;