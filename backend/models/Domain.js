// backend/models/Domain.js
module.exports = (sequelize, DataTypes) => {
  const Domain = sequelize.define(
    "Domain",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      domain: { type: DataTypes.STRING, allowNull: false, unique: true },
      owner: { type: DataTypes.STRING, allowNull: true }, // 可用于多租户标识
      token: { type: DataTypes.STRING, allowNull: false }, // 验证 token
      status: { type: DataTypes.ENUM("pending", "verified", "failed"), defaultValue: "pending" },
      lastCheckedAt: { type: DataTypes.DATE, allowNull: true },
      note: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "Domains",
      timestamps: true
    }
  );

  return Domain;
};
