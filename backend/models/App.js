// backend/models/App.js
// 注意：这里导出的是一个函数 (sequelize, DataTypes) => App
// 由 models/index.js 调用并传入同一个 sequelize 实例

module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define("App", {
    // 基础信息
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // 内部代码，例如：GO606-33
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // 商店信息
    developerName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 4.8
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    downloadsLabel: {
      // 如："2M+"
      type: DataTypes.STRING,
      allowNull: true
    },
    sizeLabel: {
      // 如："25 MB"
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedAtLabel: {
      // 如："Dec 7, 2025"
      type: DataTypes.STRING,
      allowNull: true
    },

    // 资源
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    desktopIconUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bannerUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    screenshots: {
      // 多张截图
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: []
    },
    apkUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return App;
};
