module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'favorites',
    timestamps: true
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
    Favorite.belongsTo(models.Model, { foreignKey: 'model_id' });
  };

  return Favorite;
};