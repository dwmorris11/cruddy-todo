const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;
exports.counterFile = path.join(__dirname, './counter.txt');
// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
const callbackDefault = () => {};
exports.getNextUniqueId = (callback = callbackDefault) => {
  readCounter((err, count)=>(counter = count ));
  counter = counter + 1;
  writeCounter(counter, (err, counterString) => {
    // callback(err, counterString)
    // return counterString;
    if (err) {
      throw ('err man');
    } else {
      callback(err, counterString);
    }
  });
  //callback(err, zeroPaddedNumber(counter));
  return zeroPaddedNumber(counter);
};
// console.log('dirname', __dirname);
// console.log(path.join(__dirname, 'counter.txt'));
console.log('get unique id:', exports.getNextUniqueId());


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////


