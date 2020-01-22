const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

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
  .then(result => console.log(result))
  .then(() => init());

function init() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.set('view engine', 'pug');
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

  app.get('/test', function(req, res) {
    res.render("test", { title: "Hey", message: "Hello there!" });
  });
}