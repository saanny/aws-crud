const { validator } = require("../../middlewares");
const { authentication } = require("../auth/service");
const productsController = require("./controller");
const express = require("express");
const {
  inputCreateProduct,
  findProductById,
  getAllProducts,
  deleteProductById,
  inputUpdateProduct
} = require("./schema/validation");
const router = express.Router();
const { inputValidator } = validator;

router.post(
  "/",
  inputValidator(inputCreateProduct),
  authentication,
  productsController.create
);
router.get("/", authentication, productsController.getAll);
router.get(
  "/:id",
  inputValidator(findProductById),
  authentication,
  productsController.get
);
router.delete(
  "/:id",
  inputValidator(deleteProductById),
  authentication,
  productsController.remove
);
router.patch(
  "/:id",
  inputValidator(inputUpdateProduct),
  authentication,
  productsController.update
);

module.exports = router;
