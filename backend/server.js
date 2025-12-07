
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/apps", require("./routes/apps"));

sequelize.sync().then(() => {
  app.listen(config.PORT, () =>
    console.log("Backend running on port", config.PORT)
  );
});
