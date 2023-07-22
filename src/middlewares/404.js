const { AppError } = require("../utils");

module.exports = (app) => {
  app.all("*", (req, res, next) => {
    next(new AppError(`Url ${req.originalUrl} not found`, 404));
  });
};
