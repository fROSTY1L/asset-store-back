module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    price_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    transaction_id: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'purchases',
    timestamps: true
  });

  Purchase.associate = (models) => {
    Purchase.belongsTo(models.User, { foreignKey: 'user_id' });
    Purchase.belongsTo(models.Model, { foreignKey: 'model_id' });
    Purchase.belongsTo(models.Payment, { 
      foreignKey: 'transaction_id',
      targetKey: 'transaction_id'
    });
  };

  return Purchase;
};