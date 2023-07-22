const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById
} = require("../users/service");
const { AppError } = require("../../utils");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign(
    {
      id: id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const authentication = async (req, res, next) => {
  try {
    let token;

    let authorization = req?.headers?.authorization ?? null;

    if (!authorization) throw new AppError("Authentication failed", 401);

    const tokenArray = authorization?.split(" ");
    if (tokenArray[0] != "Bearer" || !tokenArray[1])
      throw new AppError("Authentication failed", 401);
    token = tokenArray[1];

    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new AppError("Authentication failed", 401);
    }

    const freshUser = await findUserById(decoded.id);

    if (!freshUser) {
      throw new AppError("User not found", 401);
    }

    req.user = freshUser;

    next();
  } catch (error) {
    next(error);
  }
};

const registerUser = async (first_name, last_name, email, password) => {
  try {
    const userExist = await findUserByEmail(email);

    if (userExist) {
      throw new AppError("User exist", 409);
    }

    const user = await createUser(first_name, last_name, email, password);
    const token = signToken(user.id);

    return {
      user,
      token
    };
  } catch (error) {
    throw error;
  }
};
const loginUser = async (email, password) => {
  try {
    const userExist = await findUserByEmail(email);

    if (!userExist) {
      throw new AppError("Unauthorized", 401);
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);

    if (!checkPassword) {
      throw new AppError("email or password wrong", 401);
    }

    const token = signToken(userExist.id);

    return {
      user: userExist,
      token
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signToken,
  registerUser,
  loginUser,
  authentication
};
