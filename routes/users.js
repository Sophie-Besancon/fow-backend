var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  // Vérification si l'utilisateur est déjà existant
  User.findOne({ lastname: req.body.lastname }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        password: hash,
        mail:req.body.mail,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(data => {
        res.json({ result: true, data:data });
      });
    } else {
      // utilisateur déjà existant dans la bdd
      res.json({ result: false, error: 'Cet utilisateur existe déjà' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['mail', 'password'])) {
    res.json({ result: false, error: 'Champs vides ou manquants' });
    return;
  }

  User.findOne({ mail: req.body.mail }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: 'Utilisateur ou mot de passe incorrect' });
    }
  });
});

router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé' });
    }
  });
});

module.exports = router;
