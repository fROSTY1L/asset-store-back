module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    license_type: {
      type: DataTypes.ENUM('standard', 'extended'),
      defaultValue: 'standard'
    }
  }, {
    tableName: 'cart_items',
    timestamps: true
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, { foreignKey: 'user_id' });
    CartItem.belongsTo(models.Model, { foreignKey: 'model_id' });
  };

  return CartItem;
};