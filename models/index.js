'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// Check if the configuration specifies an environment variable for database connection
if (config.use_env_variable) {
  // Use the specified environment variable
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Use the configuration parameters (database, username, password, etc.)
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files in the current directory and initialize Sequelize models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import the model and add it to the 'db' object
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate models if there are associations defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach the Sequelize instance and Sequelize library to the 'db' object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
