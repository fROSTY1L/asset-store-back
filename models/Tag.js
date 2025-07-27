module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Model, { 
      through: 'model_tags',
      foreignKey: 'tag_id'
    });
  };

  return Tag;
};