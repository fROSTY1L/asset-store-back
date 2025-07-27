module.exports = (sequelize, DataTypes) => {
  const ModelTag = sequelize.define('ModelTag', {}, {
    tableName: 'model_tags',
    timestamps: false,
    underscored: true
  });

  return ModelTag;
};