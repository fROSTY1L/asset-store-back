const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig);

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Model = require('./Model')(sequelize, Sequelize.DataTypes);
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const Tag = require('./Tag')(sequelize, Sequelize.DataTypes);
const ModelFile = require('./ModelFile')(sequelize, Sequelize.DataTypes);
const Purchase = require('./Purchase')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const Review = require('./Review')(sequelize, Sequelize.DataTypes);
const CartItem = require('./CartItem')(sequelize, Sequelize.DataTypes);
const Favorite = require('./Favorite')(sequelize, Sequelize.DataTypes);
const ModelCategory = require('./ModelCategory')(sequelize, Sequelize.DataTypes);
const ModelTag = require('./ModelTag')(sequelize, Sequelize.DataTypes);

User.associate({ Model, Purchase, Payment, Review, CartItem, Favorite });
Model.associate({ User, Category, Tag, ModelFile, Purchase, Review, CartItem, Favorite });
Category.associate({ Model, Category });
Tag.associate({ Model });
ModelFile.associate({ Model });
Purchase.associate({ User, Model, Payment });
Payment.associate({ User, Purchase });
Review.associate({ User, Model });
CartItem.associate({ User, Model });
Favorite.associate({ User, Model });


module.exports = {
  sequelize,
  Sequelize,
  User,
  Model,
  Category,
  Tag,
  ModelFile,
  Purchase,
  Payment,
  Review,
  CartItem,
  Favorite,
  ModelCategory,
  ModelTag
};