const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;
const {Worker} = require('worker_threads');

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
  for (let i = 0; i <= 5_000_000_000; i++) {
    res.send(`count = ${i} \n`);
  }
  res.end('Counting task is complete now!');
});

app.get('/cpu-worker', (req, res) => {
  const myWorker = new Worker('./worker.js');
  myWorker.on('message', (messageFromWorker) => {
    res.send({message: messageFromWorker});
  });
  myWorker.postMessage('start');
});

app.listen(port, function () {
  console.log(`express running on port: ${port}`);
});
