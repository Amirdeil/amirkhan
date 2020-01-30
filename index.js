const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');
const analyzer = require('./stat-analyzer');
const shops = require('./shops/shops');

const dbUrl = `mongodb://${process.env.login}:${process.env.password}@${process.env.address}.mlab.com:${process.env.dbport}/${process.env.dbname}`;

let collection;

const port = process.env.PORT || 8000;

MongoClient.connect(dbUrl)
  .then(client => client.db(process.env.dbname))
  .then(db => db.collection('reviews'))
  .then(coll => {
    collection = coll;
    return collection.find().toArray();
  })
  .then(() => init());

function init() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use('/scripts', express.static('scripts'));
  app.set('view engine', 'pug');
  app.use(
    '/charts',
    express.static(path.join(__dirname, '/node_modules/chart.js/dist/'))
  );
  app.use(
    '/css',
    express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))
  );

  app.listen(port, function() {
    console.log(`listening on ${port}`);
  });

  app.get('/', function (req, res) {
    const shopNames = Object.keys(shops);
    res.sendFile(path.join(__dirname, '/index.html'));
    res.render('main', {
      shops: shopNames
    })
  });

  app.post('/review', (req, res) => {
    collection.insertOne(req.body);
    res.redirect(`/shop/${req.body.shop}`);
  });

  app.get('/stats/all', function(req, res) {
    collection
      .find()
      .toArray()
      .then(data => data.filter(review => review.shop))
      .then(data => {
        res.render('allStats', {
          reviews: data
        });
      });
  });

  app.get('/stats/:id', function(req, res) {
    // eslint-disable-next-line no-prototype-builtins
    if (shops.hasOwnProperty(req.params.id)) {
      res.render('stats', {
        criteria: shops[req.params.id],
        shop: req.params.id
      });
    } else {
      res.status(404).send();
    }
  });

  app.get('/shop/:id', function(req, res) {
    // eslint-disable-next-line no-prototype-builtins
    if (shops.hasOwnProperty(req.params.id)) {
      res.render('form', {
        criteria: shops[req.params.id],
        shop: req.params.id
      });
    } else {
      res.status(404).send();
    }
  });

  app.get('/api/stats/:id', function(req, res) {
    collection
      .find()
      .toArray()
      .then(data => data.filter(review => review.shop === req.params.id))
      .then(data => {
        res.json(analyzer(req.params.id, data));
      });
  });
}
