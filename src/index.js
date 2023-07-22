const express = require("express");

const {
  notFoundMiddleware,
  appMiddleware,
  customError,
  swagger
} = require("./middlewares");

const app = express();


appMiddleware(app);
require("./router")(app);
swagger(app)
customError(app);
notFoundMiddleware(app);

module.exports = {
  app
};
