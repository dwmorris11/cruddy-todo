const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const promiseReadFile = Promise.promisify(fs.readFile);


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }
    var hold = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      file = path.join(exports.dataDir, file);
      return promiseReadFile(file).then( (text) => {
        return {id: id, text: String(text)};
      }
      );
    });
    Promise.all(hold).then( (todos)=> {
      callback(null, todos);
    }
    );
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
  fs.access(`${exports.dataDir}/${id}.txt`, fs.constants.F_OK, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id: id, text: String(text) });
        }
      });
    }
  });



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
