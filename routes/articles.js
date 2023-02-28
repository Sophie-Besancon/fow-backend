var express = require('express');
var router = express.Router();

require('../models/connection');
const fetch = require('node-fetch');
const Article = require("../models/articles")

//route GET pour rechercher un produit sur la HomeScreen 
router.get('/:name', (req, res) => {
    console.log(req.params.name)
    Article.find({ name: {$regex : req.params.name, $options: 'i'}}).then(data => {
        console.log(data)
      if (data && data.length > 0) {
        res.json({ result: true, articles: data});
      } else {
        res.json({ result: false, error: 'Article non trouvé' });
      }
    });
  });

  module.exports = router;