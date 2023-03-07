const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  total: Number,
  purchaseDate: Date,
  user: String,
  isPaid: Boolean,
  articles: [{type: mongoose.Schema.Types.ObjectId, ref: "articles"}],
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;