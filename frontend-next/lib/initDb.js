// frontend-next/lib/initDb.js
import sequelize from "./db";
import App from "./models/App";

let initialized = false;

export async function initDb() {
  if (!initialized) {
    await sequelize.authenticate();
    initialized = true;
  }
  return { App };
}
