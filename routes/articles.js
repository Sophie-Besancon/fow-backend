var express = require('express');
var router = express.Router();

require('../models/connection');
const fetch = require('node-fetch');
const Article = require("../models/articles")

//route GET pour rechercher un produit sur la HomeScreen 
router.get('/:name', (req, res) => {
    console.log(req.params.name)
    Article.find({ name: { $regex: req.params.name, $options: 'i' } }).then(data => {
        console.log(data)
        if (data && data.length > 0) {
            res.json({ result: true, articles: data });
        } else {
            res.json({ result: false, error: 'Article non trouvé' });
        }
    });
});

//route GET pour afficher tous les produits disponibles en base de données dans MarketScreen 
router.get('/', (req, res) => {
    Article.find({}).then(data => {
        res.json({ result: true, allArticles: data })
    })
})

//route GET pour filtrer les produits par continent dans MarketScreen 
router.get('/continentArticles/:continentOfCountry', (req, res) => {
    Article.find({ continentOfCountry: req.params.continentOfCountry }).then(data => {
        if (data && data.length > 0) {
            res.json({ result: true, continentArticles: data });
        } else {
            res.json({ result: false });
        }
    })
})

//route GET pour filtrer les produits par catégorie dans MarketScreen 
router.get('/categoryArticles/:categoryName', (req, res) => {
    Article.find({ categoryName: req.params.categoryName }).then(data => {
        if (data && data.length > 0) {
            res.json({ result: true, categoryArticles: data });
        } else {
            res.json({ result: false });
        }
    })
})

module.exports = router;