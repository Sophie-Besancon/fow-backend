var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Route permettant l'inscription de l'utilisateur
// Cyril
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["lastname", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  // Vérification si l'utilisateur est déjà existant

  User.findOne({ lastname: req.body.lastname }).then((data) => {
    const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    const mailTest = regex.test(req.body.mail);

    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hash,
        mail: req.body.mail,
        token: uid2(32),
        canBookmark: true,
      });

      newUser.save().then((data) => {
        res.json({ result: true, data: data });
      });
    } else if (!mailTest) {
      res.json({
        result: false,
        error: "❗️Votre adresse mail est incorrecte",
      });
    } else {
      // utilisateur déjà existant dans la bdd
      res.json({ result: false, error: "Cet utilisateur existe déjà" });
    }
  });
});

// Route permettant la connexion de l'utilisateur
//Cyril
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["mail", "password"])) {
    res.json({ result: false, error: "Champs vides ou manquants" });
    return;
  }

  User.findOne({ mail: req.body.mail }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data: data });
    } else {
      res.json({
        result: false,
        error: "Utilisateur ou mot de passe incorrect",
      });
    }
  });
});

router.get("/infos/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    }
  });
});

//route PUT pour enregistrer l'état isLiked de chaque article dans la BDD
// thibault
router.put("/updateFavoriteArticle", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "Utilisateur non trouvé" });
    } else {
      let articleArray = data.articlesinFavorite;
      if (articleArray.includes(req.body.articleId)) {
        articleArray = articleArray.filter(
          (article) => article.toString() !== req.body.articleId
        );
      } else {
        articleArray.push(req.body.articleId);
      }
      User.findOneAndUpdate(
        { token: req.body.token },
        { articlesinFavorite: articleArray }
      ).then(() => {
        User.findOne({ token: req.body.token })
          .populate("articlesinFavorite")
          .then((data) => {
            res.json({ result: true, data:data });
          });
      });
    }
  });
});

// route PUT qui permet de mettre a jour les données utilisateur
// Cyril
router.put("/updateUserInformations/:token", (req, res) => {
  const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  const mailTest = regex.test(req.body.mail);

  if (req.body.password != null) {
    var hash = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.firstname != "" && req.body.lastname != "" && mailTest) {
    User.findOneAndUpdate(
      { token: req.params.token },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mail: req.body.mail,
        password: hash,
      }
    ).then((data) => {
      if (data) {
        res.json({
          result: true,
          data: data,
          message: "✅ Toutes est bien enregistré !",
        });
      } else {
        res.json({ result: false, message: "❌ Utilisateur non trouvé" });
      }
    });
  } else {
    res.json({
      result: false,
      message: "❗️Adresse mail incorrecte ou champs manquants",
    });
  }
});

//route POST qui permet d'ajouter une nouvelle adresse à un utilisateur
// Cyril
router.post("/add_address/:token", (req, res) => {
  if (
    req.body.street != null &&
    req.body.city != null &&
    req.body.zipCode != null &&
    req.body.country != null
  ) {
    var dataCity = {
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
      isBillingAddress: req.body.isBillingAddress,
      isDeliveryAddress: req.body.isDeliveryAddress,
    };
  } else {
    res.json({ result: false, message: "❌ Des champs sont manquants" });
    return;
  }

  User.findOne({ token: req.params.token }).then((dataFind) => {
    let changeInformations = [...dataFind.address];
    if (req.body.isBillingAddress) {
      for (let element of changeInformations) {
        element.isBillingAddress = false;
      }
    } else if (req.body.isDeliveryAddress) {
      for (let element of changeInformations) {
        element.isDeliveryAddress = false;
      }
    }

    changeInformations.push({ ...dataCity });
    User.findOneAndUpdate(
      { token: req.params.token },
      {
        address: changeInformations,
      }
    ).then((dataUpdate) => {
      res.json({
        result: true,
        message: "✅ Nouvelle adresse enregistrée",
        data: dataUpdate,
      });
    });
  });
});

//route GET pour récupérer les articles favoris d'un utilisateur
// thibault
router.post("/favoriteArticle", (req, res) => {
        User.findOne({ token: req.body.token })
          .populate("articlesinFavorite")
          .then((data) => {
            res.json({ result: true, articlesinFavorite :data.articlesinFavorite });
          });
      });


//route GET pour regarder si l'utilisateur a rentré une adresse
//Sophie
router.get("/verifyAddress/:token", (req,res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data.address.length > 0) {
      console.log(data.address.length)
      res.json({ result: true});
    } else {
      res.json({ result: false, error: "Pas d'adresse enregistrée" });
    }
  });
});

module.exports = router;
