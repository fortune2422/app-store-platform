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
    apkKey: { type: DataTypes.STRING },         // R2 object key
    iconKey: { type: DataTypes.STRING },
    desktopIconKey: { type: DataTypes.STRING },
    bannerKey: { type: DataTypes.STRING },
    screenshotKeys: { type: DataTypes.ARRAY(DataTypes.STRING) }, // Postgres array
    apkUrl: { type: DataTypes.STRING },          // public url
    iconUrl: { type: DataTypes.STRING },
    desktopIconUrl: { type: DataTypes.STRING },
    bannerUrl: { type: DataTypes.STRING },
    screenshots: { type: DataTypes.ARRAY(DataTypes.STRING) },

    note: DataTypes.TEXT
  },
  {
    tableName: "Apps"
  }
);

module.exports = App;
