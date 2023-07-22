const express = require("express");

const {
  notFoundMiddleware,
  appMiddleware,
  customError,
} = require("./middlewares");

const app = express();


appMiddleware(app);
require("./router")(app);
customError(app);
notFoundMiddleware(app);

module.exports = {
  app
};
