const express = require('express');
const socketIo = require('socket.io');
const axios = require('axios');
const https = require('https');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080;
const memesData = require('./public/assets/images.json');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/new-game', express.static(path.join(__dirname, 'public/app')));
app.use('/join-game', express.static(path.join(__dirname, 'public/app')));

function searchMemes (query) {
  return memesData.filter(meme => meme.name.toLowerCase().includes(query.toLowerCase()));
}

// Search endpoint
app.get('/search-memes', (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Search query is required');
  }
  const results = searchMemes(query);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Listening on port ${ port }`);
});
