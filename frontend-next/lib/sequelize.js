// frontend-next/lib/sequelize.js
const { Sequelize } = require("sequelize");

let sequelize;

if (!global._sequelize) {
  global._sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false
  });
}

sequelize = global._sequelize;

module.exports = sequelize;
