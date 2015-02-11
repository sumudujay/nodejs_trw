'use strict';

const
  cluster = require('cluster'),
  fs = require('fs'),
  zmq = require('zmq');

if (cluster.isMaster) {
  
  //master process - create ROUTER and DEALER sockets, bind endpoints
  let
    router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
    dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');
  
  //forward messages between router and dealer
  // router rates a msg and then send it to the dealer which will send it through
  // the IPC socket to one of the REP workers
  router.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });
  
  // dealer takes the msg from the REP workers through IPC and sends it to
  // the router which will forward it to the requestor
  dealer.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });
  
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });
  
  //fork three worker processes
  for (let i = 0; i < 3; i++) {
    cluster.fork();
  }
} else {
  let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');
  
  responder.on('message', function(data) {
    //parse incoming data
    let request = JSON.parse(data);
    console.log(process.pid + ' received request for: ' + request.path);
    
    // read file and reply with content
    fs.readFile(request.path, function(err, data) {
      console.log(process.pid + ' sending response');
      responder.send(JSON.stringify({
                                      pid: process.pid,
                                      data: data.toString(),
                                      timestamp: Date.now()
      }));
    });
  });
}
  
  
  
  
  
  