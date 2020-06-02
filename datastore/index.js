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
  const allFiles = fs.readdirSync(exports.dataDir).forEach(file => {
    id = file.slice(0, 5);
    //readOne  = get text in the file
    exports.readOne(id, (item) => {
      items[item.id] = item.text;
    });
    //insert into items object the id and the text
  });
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};




exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  fs.unlink(`${exports.dataDir}/${id}.txt`, () => {
    if (!item) {
      // report an error if item not found
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
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
