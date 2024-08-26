require("./config/db");

const express = require("express");
const bodyParser = require("express").json;
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser());
app.use("/api/v1", routes);

module.exports = app;
