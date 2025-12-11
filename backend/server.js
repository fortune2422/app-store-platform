const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config");
// server.js (片段)
const required = ["R2_BUCKET", "R2_ACCESS_KEY", "R2_SECRET_KEY", "DATABASE_URL"];
required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`Warning: env ${k} is not set`);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/apps", require("./routes/apps"));

sequelize.sync().then(() => {
  app.listen(config.PORT, () =>
    console.log("Backend running on port", config.PORT)
  );
});
