var express = require('express');
var router = express.Router();

require('../models/connection');
const fetch = require('node-fetch');
const Article = require("../models/articles")

//route GET pour rechercher un produit sur la HomeScreen 
router.get('/:searchArticle', (req, res) => {
    console.log(req.params.name)
    Article.findOne({ name: {$regex : `/${req.params.name}/`}}).then(data => {
        console.log(data)
      if (data) {
        res.json({ result: true, articles: data});
      } else {
        res.json({ result: false, error: 'Article non trouvé' });
      }
    });
  });

  module.exports = router;