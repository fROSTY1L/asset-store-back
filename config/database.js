module.exports = {
  database: "AssetStore",
  username: "postgres",
  password: "frosty1l7651",
  host: "localhost",
  dialect: "postgres",
  logging: console.log,
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  }
};

