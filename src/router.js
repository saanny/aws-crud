const { router: authRouter } = require("./modules/auth");
const { router: productsRouter } = require("./modules/products");

module.exports = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/products", productsRouter);
  
};
