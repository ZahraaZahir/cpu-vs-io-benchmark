const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.get('/io', function (req, res) {
  fs.readFile('./dummy.txt', (err, data) => {
    if (err) {
      console.error('An error occurred:', err);
      return;
    }
    res.end(data.toString());
  });
});

app.get('/cpu', (req, res) => {
  for (let i = 0; i <= 5_000_000_000; i++) {}
  res.end('Counting task is complete now!');
});

app.listen(port, function () {
  console.log(`express running on port: ${port}`);
});
