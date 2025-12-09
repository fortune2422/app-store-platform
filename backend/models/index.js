// backend/models/index.js
const sequelize = require("../sequelize");
const App = require("./App");

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

initDb();

module.exports = {
  sequelize,
  App
};
