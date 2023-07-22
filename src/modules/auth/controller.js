const httpStatus = require("http-status");
const { response } = require("../../utils/functions");
const { registerUser, loginUser } = require("./service");

const register = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const { user, token } = await registerUser(
      first_name,
      last_name,
      email,
      password
    );

    return response({
      res,
      statusCode: httpStatus.CREATED,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUser(email, password);
    return response({
      res,
      statusCode: httpStatus.OK,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
