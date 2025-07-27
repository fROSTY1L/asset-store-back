module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    telegram_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    language_code: {
      type: DataTypes.STRING(10),
      defaultValue: "en",
    },
    role: {
      type: DataTypes.ENUM('User', 'Admin'),
      defaultValue: "User",
    },
    status: {
      type: DataTypes.ENUM('online', 'offline'),
      defaultValue: "online"
    },
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Model, {
      foreignKey: 'creator_id',
      as: 'createdModels'
    });
  };

  return User;
};