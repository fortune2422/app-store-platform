// backend/models/index.js
const path = require("path");
const Sequelize = require("sequelize");

// 你的 sequelize 连接（确保 ../sequelize 返回一个 Sequelize 实例）
const sequelize = require("../sequelize");

// 导入模型函数（假设每个 model 文件导出 function (sequelize, DataTypes) => Model）
const AppModel = require(path.join(__dirname, "App"));
const DomainModel = require(path.join(__dirname, "Domain"));

// 初始化模型
const App = AppModel(sequelize, Sequelize.DataTypes);
const Domain = DomainModel(sequelize, Sequelize.DataTypes);

// 如果模型之间有关系，在这里建立，例如：
// Domain.belongsTo(App, { foreignKey: 'ownerAppId' });

const db = {
  sequelize,
  Sequelize,
  App,
  Domain
};

// 测试连接并打印
async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
initDb();

module.exports = db;
