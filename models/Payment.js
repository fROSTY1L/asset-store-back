module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'   
    }
  }, {
    tableName: 'payments',
    timestamps: true
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: 'user_id' });
    Payment.hasMany(models.Purchase, {
      foreignKey: 'transaction_id',
      sourceKey: 'transaction_id'
    });
  };

  return Payment;
};