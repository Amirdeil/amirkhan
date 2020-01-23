const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const credentials = require('./credentials.json');
const analyzer = require('./stat-analyzer');

const dbUrl = `mongodb://${process.env.login}:${process.env.password}@${process.env.address}.mlab.com:${process.env.dbport}/${process.env.dbname}`;

let collection; 

const port = process.env.PORT || 8000;

let collection;
let cookedData;

MongoClient.connect(dbUrl)
  .then(client => client.db(process.env.dbname))
  .then(db => db.collection('reviews'))
  .then(coll => {
    collection = coll;
    return collection.find().toArray();
  })
  .then(result => {
    console.log(analyzer(result));
  })
  .then(() => init());

function init() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use('/scripts', express.static("scripts"));
  app.set('view engine', 'pug');
  app.use(
    '/charts', express.static(__dirname + '/node_modules/chart.js/dist/')
  )
  app.use(
    "/css",
    express.static(__dirname + "/node_modules/bootstrap/dist/css")
  );

  app.listen(port, function() {
    console.log(`listening on ${port}`);
  });

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.post("/review", (req, res) => {
    collection.insertOne(req.body);
    res.redirect("/");
  });

  app.get('/test', function (req, res) {
    collection.find().toArray().then((data2) => {
      console.log('hello', data2);
    })
    res.render("test", { title: "Hey", message: "Hello there!" });
  });

  app.get('/api/stats', function (req, res) {
    collection
      .find()
      .toArray()
      .then(data => {
        res.json(analyzer(data))
      });
  })
}