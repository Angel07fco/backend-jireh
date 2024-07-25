require("./config/db");

const express = require("express");
const bodyParser = require("express").json;
const cors = require("cors");
const routes = require("./routes");
const startScheduler = require('../src/domains/citas/scheduler');

const app = express();

app.use(cors({
    origin: "*",
}));
app.use(bodyParser());
app.use("/api/v1", routes);

// Iniciar el cron job
startScheduler();

module.exports = app;