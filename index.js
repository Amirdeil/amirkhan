const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const { sections } = require('./populate/sections');

const token = process.env.bottoken;
const { tgroomname } = process.env;
const bot = new TelegramBot(token, { polling: true });

const port = process.env.PORT || 8000;

init();

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

  app.get('/', function(req, res) {
    res.render('main', { sections });
  });

  app.post('/feedback', (req, res) => {
    res.redirect(`/`);
    const { section, text } = req.body;
    if (!section || !text) {
      return;
    }
    bot
      .sendMessage(`@${tgroomname}`, `${section}:\n${text}`)
      .catch(e => console.log(e));
  });

  app.get('/section/:id', function(req, res) {
    // eslint-disable-next-line no-prototype-builtins
    if (sections.includes(req.params.id)) {
      res.render('form', {
        section: req.params.id
      });
    } else {
      res.status(404).send();
    }
  });
}
