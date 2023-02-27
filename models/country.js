const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
  name: String,
  continent: [{type: mongoose.Schema.Types.ObjectId, ref: "continents"}],
  flagImage: String,
});

const Country = mongoose.model('countries', countrySchema);

module.exports = Country;