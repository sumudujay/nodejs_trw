'use strict';

const
  file = require('file');

file.walk(process.argv[2], function(err, dirPath, dirs, file) {
  console.log(dirs);
  console.log(file);
})
