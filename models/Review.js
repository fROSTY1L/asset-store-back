module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: DataTypes.TEXT,
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'reviews',
    timestamps: true
  });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
    Review.belongsTo(models.Model, { foreignKey: 'model_id' });
  };

  return Review;
};