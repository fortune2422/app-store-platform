// frontend-next/lib/models/index.js
const sequelize = require("../sequelize");
const App = require("./App");

async function initDb() {
  // 如果你确定数据库结构已经建好了，可以把 sync 注释掉
  await sequelize.authenticate();
  // await sequelize.sync(); // 初期调试可以开，稳定后关掉
}

module.exports = {
  sequelize,
  App,
  initDb
};
