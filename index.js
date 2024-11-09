require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const urlDatabase = new Map();
let idCounter = 1;


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST endpoint for URL shortening
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Basic URL validation (simple regex)
  const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  if (!urlPattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if URL already exists
  let shortUrl = Array.from(urlDatabase.entries()).find(entry => entry[1] === url)?.[0];

  // If not, add it to the database
  if (!shortUrl) {
    shortUrl = idCounter++;
    urlDatabase.set(shortUrl, url);
  }

  res.json({
    original_url: url,
    short_url: shortUrl
  });
});

// Redirect endpoint for short URLs
app.get('/api/shorturl/:id', (req, res) => {
  const originalUrl = urlDatabase.get(parseInt(req.params.id));

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'No short URL found for the given input' });
  }
});

// https://www.freecodecamp.com

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
