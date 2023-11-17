const express = require('express');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/new-game', express.static(path.join(__dirname, 'public/app')));
app.use('/join-game', express.static(path.join(__dirname, 'public/app')));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
