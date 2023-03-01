var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
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
        address:null,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // utilisateur déjà existant dans la bdd
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['lastname', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ lastname: req.body.lastname }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.get('/canBookmark/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canBookmark: data.canBookmark });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

module.exports = router;
