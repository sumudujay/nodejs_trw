'use strict';const  async = require('async'),  file = require('file'),  rdfParser = require('./lib/rdf-parser.js'),  pathModule = require('path'),  request = require('request'),  work = async.queue(function(path, done) {    rdfParser(path, function(err, doc) {      console.log(doc);      done();    });  }, 1000);console.log('beginning directory walk');file.walk(__dirname + '/cache', function(err, dirPath, dirs, files) {  files.forEach(function(path){    if (pathModule.extname(path) == '.rdf') {      work.push(path);    };  });});