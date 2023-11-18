const sqlite3 = require('sqlite3');
const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');
const https = require('https');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const port = 8080;
const memesData = require('./public/assets/images.json');

/**
 * Initialize the Database
 */
let db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

/**
 * Initialize the application
 * @type {*|Express}
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

/**
 * Utilities
 */
function searchMemes (query) {
  return memesData.filter(meme => meme.name.toLowerCase().includes(query.toLowerCase()));
}

function randomMemes () {
  let shuffled = memesData.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
}

/**
 * Endpoints
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/new-game', express.static(path.join(__dirname, 'public/app')));
app.use('/join-game', express.static(path.join(__dirname, 'public/app')));

// Search endpoint
app.get('/search-memes', (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Search query is required');
  }
  const results = searchMemes(query);
  res.json(results);
});

app.get('/starting-memes', (req, res) => {
    res.json(randomMemes());
});

app.post('/save-selected-memes', (req, res) => {
  const { playerId, memeIds } = req.body;
  console.log(playerId);
  console.log(memeIds);

  // Logic to save the meme IDs and player association in the database
  // db.run("INSERT INTO ...");

  res.json({ message: 'Memes saved successfully' });
});

app.get('/login', (req, res) => {
  const hashedIp = crypto.createHash('sha256').update(req.ip).digest('hex');

  db.run('INSERT INTO client_hashes (hashed_ip) VALUES (?)', [hashedIp], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error while inserting data");
    } else {
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.json({ hash: hashedIp }); // Send the hash back to the user
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${ port }`);
});
