"use strict";

const
  cluster = require('cluster');

if (cluster.isMaster) {
  for (let i = 0; i < 10; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' exited with code ' + code);
  });

} else {
  console.log('Worker here!');
  setInterval(function() {
    cluster.worker.kill();
  }, 5000);
}
