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

// router.post("/add_address/:token", (req, res) => {
//     if (
//       req.body.street != null &&
//       req.body.city != null &&
//       req.body.zipCode != null &&
//       req.body.country != null
//     ) {
//       var dataCity = {
//         street: req.body.street,
//         city: req.body.city,
//         zipCode: req.body.zipCode,
//         country: req.body.country,
//         isBillingAddress: req.body.isBillingAddress,
//         isDeliveryAddress: req.body.isDeliveryAddress,
//       };
//     } else {
//       res.json({ result: false, message: "❌ Des champs sont manquants" });
//       return;
//     }

//     User.findOne({ token: req.params.token }).then((dataFind) => {
//       let changeInformations = [...dataFind.address];
//       if (req.body.isBillingAddress) {
//         for (let element of changeInformations) {
//           element.isBillingAddress = false;
//         }
//       } else if (req.body.isDeliveryAddress) {
//         for (let element of changeInformations) {
//           element.isDeliveryAddress = false;
//         }
//       }

//       changeInformations.push({ ...dataCity });
//       User.findOneAndUpdate(
//         { token: req.params.token },
//         {
//           address: changeInformations,
//         }
//       ).then((dataUpdate) => {
//         res.json({
//           result: true,
//           message: "✅ Nouvelle adresse enregistrée",
//           data: dataUpdate,
//         });
//       });
//     });
//   });
module.exports = router;