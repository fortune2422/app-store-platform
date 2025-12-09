// frontend-next/lib/models/App.js
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const App = sequelize.define("App", {
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

  iconUrl: DataTypes.STRING,
  desktopIconUrl: DataTypes.STRING,
  bannerUrl: DataTypes.STRING,

  // 用数组存截图 URL
  screenshots: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },

  apkUrl: DataTypes.STRING,

  landingDomain: DataTypes.STRING,
  note: DataTypes.TEXT
});

module.exports = App;
