const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
street: String,
city: String,
zipCode: String,
country: String,
isBillingAddress: Boolean,
isDeliveryAddress: Boolean,
})

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  mail: String,
  password: String,
  token:String,
  address: [addressSchema],
  articlesinFavorite: [{type: mongoose.Schema.Types.ObjectId, ref: "articles"}],
  articlesinBasket: [{type: mongoose.Schema.Types.ObjectId, ref: "articles"}],
  canBookmark: {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;