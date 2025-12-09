// frontend-next/lib/initDb.js
import sequelize from "./db";
import App from "./models/App";

let initialized = false;

export async function initDb() {
  if (!initialized) {
    await sequelize.authenticate();
    // 不 sync，不改表结构，只确认连得上
    initialized = true;
  }
  return { App };
}
