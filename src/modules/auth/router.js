const userController = require("./controller");
const { validator } = require("../../middlewares");
const { inputLogin, inputRegister } = require("./schema/validation");
const express = require("express");
const router = express.Router();
const { inputValidator } = validator;

router.post(
  "/register",
  inputValidator(inputRegister),
  userController.register
);
router.post("/login", userController.login, inputValidator(inputLogin));

module.exports = router;
