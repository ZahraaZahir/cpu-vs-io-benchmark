const {parentPort} = require('worker_threads');

parentPort.on('message', (task) => {
  for (let i = 0; i <= 5_000_000_000; i++) {
  }
  parentPort.postMessage('Counting task is complete now!');
});
