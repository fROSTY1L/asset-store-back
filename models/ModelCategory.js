module.exports = (sequelize, DataTypes) => {
  const ModelCategory = sequelize.define('ModelCategory', {
    primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'model_categories',
    timestamps: false,
    underscored: true
  });

  return ModelCategory;
};