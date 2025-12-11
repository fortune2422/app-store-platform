// backend/models/index.js
const fs = require("fs");
const path = require("path");
const sequelize = require("../sequelize");
const config = require("../config");
const App = require("./App");
const Domain = require("./Domain")(sequelize, Sequelize.DataTypes);
db.Domain = Domain;

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
