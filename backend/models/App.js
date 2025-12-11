// backend/models/App.js
module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define(
    "App",
    {
      // 基础
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: { type: DataTypes.STRING, allowNull: false },
      code: { type: DataTypes.STRING, allowNull: true },
      packageName: { type: DataTypes.STRING, allowNull: true },
      version: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },

      // 商店信息
      developerName: { type: DataTypes.STRING, allowNull: true },
      rating: { type: DataTypes.FLOAT, allowNull: true },
      reviewsCount: { type: DataTypes.INTEGER, allowNull: true },
      downloadsLabel: { type: DataTypes.STRING, allowNull: true },
      sizeLabel: { type: DataTypes.STRING, allowNull: true },
      updatedAtLabel: { type: DataTypes.STRING, allowNull: true },

      // 落地页 / 自定义域
      landingDomain: { type: DataTypes.STRING, allowNull: true },

      // 文件 URL + 存储 key（兼容直接 publicUrl 与 key-based strategy）
      apkUrl: { type: DataTypes.TEXT, allowNull: true },
      apkKey: { type: DataTypes.TEXT, allowNull: true },

      iconUrl: { type: DataTypes.TEXT, allowNull: true },
      iconKey: { type: DataTypes.TEXT, allowNull: true },

      desktopIconUrl: { type: DataTypes.TEXT, allowNull: true },
      desktopIconKey: { type: DataTypes.TEXT, allowNull: true },

      bannerUrl: { type: DataTypes.TEXT, allowNull: true },
      bannerKey: { type: DataTypes.TEXT, allowNull: true },

      // 截图 - 保留旧字段（如果你之前用 screenshots JSON），并新增 screenshotKeys_jsonb 更稳妥
      screenshots: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
      screenshotKeys_jsonb: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },

      // 备注 / 其它
      note: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "Apps",
      timestamps: true,
      indexes: [
        { fields: ["code"] },
        { fields: ["landingDomain"] }
      ]
    }
  );

  return App;
};
