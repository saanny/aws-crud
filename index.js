const {app} = require("./src")

const serverless = require("serverless-http");

module.exports.handler = serverless(app);
