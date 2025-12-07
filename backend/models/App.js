
module.exports = (sequelize, DataTypes) =>
  sequelize.define("App", {
    name: DataTypes.STRING,
    packageName: DataTypes.STRING,
    version: DataTypes.STRING,
    description: DataTypes.TEXT,
    iconUrl: DataTypes.STRING,
    screenshots: { type: DataTypes.JSON, defaultValue: [] },
    apkUrl: DataTypes.STRING,
    downloadCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
