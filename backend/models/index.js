
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

const App = require("./App")(sequelize, DataTypes);

module.exports = { sequelize, App };
