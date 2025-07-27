module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  Category.associate = (models) => {
    Category.belongsToMany(models.Model, { through: 'model_categories', foreignKey: 'category_id' });
    Category.belongsTo(models.Category, { foreignKey: 'parent_id', as: 'parent' });
    Category.hasMany(models.Category, { foreignKey: 'parent_id', as: 'children' });
  };

  return Category;
};