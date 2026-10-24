'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV ?? 'development';
const { host, port, dbName } = require(__dirname + '/../config/mongoConfig.js')[
  env
];
const db = {};

mongoose
  .connect(`mongodb://${host}:${port}/${dbName}`)
  .then(() => console.log(`DB connection OK`))
  .catch(err => console.log(err));

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.modelName] = model;
  });

module.exports = db;
