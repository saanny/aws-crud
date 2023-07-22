const { functions } = require("../utils");
const Joi = require("joi");

const { pick } = functions;

const inputValidator = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    let errorMessage = "";
    for (const err of error.details) {
      errorMessage +=
        " [ " +
        err.path.join(" > ") +
        err.message.slice(err.message.lastIndexOf('"') + 1) +
        " ] ";
    }
    return res.status(400).json({
      status: "Bad request",
      message: "Inputs not valid",
      error: errorMessage
    });
  }
  Object.assign(req, value);
  return next();
};
module.exports = {
  inputValidator
};
