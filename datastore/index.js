const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
var dirpath = path.join(__dirname, 'datastore/data/');

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error writing text in ' + id + '.txt');
      } else {
        callback (null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  items = {};
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    var hold = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      return {id: id, text: id};
      // var returnVariable;
      // fs.readFile(`${exports.dataDir}/${id}.txt`, (err, string) => {
      //   if (err) {
      //     console.log('err: ', err);
      //     callback(err);
      //   }
      //   console.log({ id: id, text: String(string) });
      //   returnVariable = { id: id, text: String(string) };
      // });
      // console.log('return: ', returnVariable);
      // return returnVariable;
    });
    callback(null, hold);
  });
};

exports.readOne = (id, callback) => {
  var myPath = exports.dataDir + '/' + id + '.txt';
  fs.readFile(myPath, (err, text) => {
    if (err) {
      callback(new Error(`No file to read with id: ${id}`));
    } else {
      callback(null, {id: id, text: String(text)});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id: id, text: String(text) });
  }
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err, item) => {
    if (err) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
