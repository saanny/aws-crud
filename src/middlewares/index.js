module.exports = {
  appMiddleware: require("./appMiddlewares"),
  notFoundMiddleware: require("./404"),
  validator: require("./validators"),
  customError: require("./customError"),
  swagger:require("./swagger")
  // s3Uploader:require("./s3Uploader")
};
