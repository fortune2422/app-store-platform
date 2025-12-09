// backend/models/App.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const App = sequelize.define(
  "App",
  {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    packageName: DataTypes.STRING,
    version: DataTypes.STRING,
    description: DataTypes.TEXT,
    developerName: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    reviewsCount: DataTypes.INTEGER,
    downloadsLabel: DataTypes.STRING,
    sizeLabel: DataTypes.STRING,
    updatedAtLabel: DataTypes.STRING,
    landingDomain: DataTypes.STRING,
    iconUrl: DataTypes.STRING,
    desktopIconUrl: DataTypes.STRING,
    bannerUrl: DataTypes.STRING,
    screenshots: DataTypes.ARRAY(DataTypes.TEXT),
    apkUrl: DataTypes.STRING,
    note: DataTypes.TEXT
  },
  {
    tableName: "Apps"
  }
);

module.exports = App;
