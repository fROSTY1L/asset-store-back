const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  database: "AssetStore",
  username: "postgres",
  password: "frosty1l7651",
  host: "localhost",
  dialect: "postgres",
  logging: console.log,
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  }
});

const loadModels = () => {
  const models = {};
  const modelFiles = [
    'User', 'Model', 'Category', 'Tag',
    'ModelFile', 'Purchase', 'Payment',
    'Review', 'CartItem', 'Favorite',
    'ModelCategory', 'ModelTag'
  ];

  modelFiles.forEach(file => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};

module.exports = {
  sequelize,
  loadModels
};