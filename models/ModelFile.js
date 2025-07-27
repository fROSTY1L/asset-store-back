// models/ModelFile.js
module.exports = (sequelize, DataTypes) => {
  const ModelFile = sequelize.define('ModelFile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_type: {
      type: DataTypes.ENUM('preview', 'texture', 'model', 'other'),
      allowNull: false
    },
    file_format: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER
    },
    is_main_model: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'model_files',
    timestamps: true
  });

  ModelFile.associate = (models) => {
    ModelFile.belongsTo(models.Model, { foreignKey: 'model_id' });
  };

  return ModelFile;
};