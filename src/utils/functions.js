const httpStatus = require("http-status");

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const response = ({
  res,
  statusCode = httpStatus.OK,
  status = "success",
  message = null,
  data = null,
  error = null
}) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
    error
  });
};

module.exports = {
  pick,
  response
};
