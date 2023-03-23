const request = require('supertest');
const app = require('../app');

it('GET /articles', async () => {
    const res = await request(app).get('/articles');
    // On teste que la route reponde bien
    expect(res.statusCode).toBe(200);
    // On teste que la route renvoie le bon nombre d'articles (22)
    expect(res.body.allArticles.length).toEqual(22);
   });

it('POST /articles', async () => {
    const res = await request(app).post('/articles').send({name : "Mochi"});
    // On teste que la route reponde bien
    expect(res.statusCode).toBe(200);
    // On teste que la route renvoie bien un seul article recherche et qu'il correspond a la recherche
    expect(res.body.filteredArticles.length).toEqual(1);
    expect(res.body.filteredArticles[0].name).toEqual("Mochis cacao-fraise");
});