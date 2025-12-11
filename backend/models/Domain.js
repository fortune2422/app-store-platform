// backend/models/Domain.js
module.exports = (sequelize, DataTypes) => {
  const Domain = sequelize.define("Domain", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    owner: {
      type: DataTypes.STRING, // 可保存用户 id / email；先留字符串
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("pending", "verified", "failed"),
      defaultValue: "pending"
    },
    lastCheckedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return Domain;
};
