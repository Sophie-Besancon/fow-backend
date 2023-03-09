var express = require('express');
var router = express.Router();
const Order = require("../models/orders");

// route POST pour envoyer la commande validée en base de données
router.post('/', (req, res) => {
    const date = new Date();
    const newOrder = new Order({
        total: req.body.total,
        purchaseDate: date,
        user: req.body.user,
        isPaid: true,
        articles: req.body.articles,
    })
    newOrder.save().then((data) => {
        res.json({ result: true, data: data });
    });
})

// route GET pour récupérer les commandes d'un utilisateur
router.get('/:token', (req, res) => {
    Order.find({user: req.params.token}).then((data) => {
        if (data) {
            res.json({ result: true, data: data });
        } else {
            res.json({ result: false });
        }   
    });
})

module.exports = router;