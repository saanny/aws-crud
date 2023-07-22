module.exports = (app) => {
  app.use((err, req, res, next) => {
    const status = (err.statusCode && err.statusCode) || 500;
    const message = err.message || "Something went wrong";
    const error = err.error || "Internal Server Error";

    res.status(err.statusCode ? err.statusCode : 500).json({
      status: status,
      message: message,
      error: error
    });
  });
};
