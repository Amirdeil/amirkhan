const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const credentials = require('./credentials.json');

MongoClient.connect(
  `mongodb://${credentials.login}:${credentials.password}@${credentials.address}.mlab.com:${credentials.port}/${credentials.dbname}`
  , (err, client) => {
    if (err) {
      console.log(err);
      return;
    }
    let db = client.db(credentials.dbname);
    db.collection('reviews').find().toArray(function (err, results) {
      console.log(results)
      // send HTML file populated with quotes here
    })
    db.collection('reviews');
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

  app.listen(3000, function() {
    console.log("listening on 3000");
  });

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.post("/review", (req, res) => {
    console.log(req.body);
    db.collection('reviews').insertOne(req.body);
    res.redirect("/");
  });
});