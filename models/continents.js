const mongoose = require('mongoose');

const continentSchema = mongoose.Schema({
  name: String,
  image: String,
});

const Continent = mongoose.model('continents', continentSchema);

module.exports = Continent;