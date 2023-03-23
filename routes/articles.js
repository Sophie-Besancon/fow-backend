var express = require("express");
var router = express.Router();

require("../models/connection");
const Article = require("../models/articles");

//route GET pour rechercher un produit sur la HomeScreen
// router.get("/:name", (req, res) => {
//   console.log(req.params.name);
//   Article.find({ name: { $regex: req.params.name, $options: "i" } }).then(
//     (data) => {
//       console.log(data);
//       if (data && data.length > 0) {
//         res.json({ result: true, articles: data });
//       } else {
//         res.json({ result: false, error: "Article non trouvé" });
//       }
//     }
//   );
// });

// route POST pour filtrer les articles par Continent et/ou Catégorie ou par nom pour la MarketScreen
router.post("/", (req, res) => {
  const continent = req.body.continent ? req.body.continent : { $exists: true };
  const category = req.body.category ? req.body.category : { $exists: true };
  const name = req.body.name
    ? { $regex: req.body.name, $options: "i" }
    : { $exists: true };

  Article.find({
    continentOfCountry: continent,
    categoryName: category,
    name: name,
  }).then((data) => {
    res.json({ result: true, filteredArticles: data });
  });
});

//route GET pour afficher tous les produits disponibles en base de données dans MarketScreen
router.get("/", (req, res) => {
  Article.find({}).then((data) => {
    console.log("DATA ARTICLES : ", data);
    res.json({ result: true, allArticles: data });
  });
});

module.exports = router;
