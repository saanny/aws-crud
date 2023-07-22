const express = require("express");
const cors = require("cors");
module.exports = (app) => {
  app.use(
    cors({
      origin: "*",
      credentials: true
    })
  );
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50
    })
  );
  app.use(express.json({ limit: "50mb" }));
};
