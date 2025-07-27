module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Model', {
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
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    polygon_count: DataTypes.INTEGER,
    file_size: DataTypes.INTEGER,
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    preview_image: {
      type: DataTypes.STRING,
    },
    model_file_url: {
      type: DataTypes.STRING,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'models',
    timestamps: true
  });

  Model.associate = (models) => {
    Model.belongsTo(models.User, { foreignKey: 'creator_id', as: 'creator' });
    Model.belongsToMany(models.Category, { 
      through: 'model_categories', 
      foreignKey: 'model_id' 
    });
    Model.belongsToMany(models.Tag, { 
      through: 'model_tags', 
      foreignKey: 'model_id' 
    });
    Model.hasMany(models.ModelFile, { 
      foreignKey: 'model_id',
      as: 'files'
    });
    Model.hasMany(models.Purchase, { foreignKey: 'model_id' });
    Model.hasMany(models.Review, { foreignKey: 'model_id' });
  };

  return Model;
};