const httpStatus = require("http-status");
const { response } = require("../../utils/functions");
const {
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct
} = require("./service");

const create = async (req, res, next) => {
  const { name, detail } = req.body;
  try {
    const product = await createProduct(name, detail, req.user);
    return response({ res, statusCode: httpStatus.CREATED, data: product });
  } catch (error) {
    next(error);
  }
};
const get = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await getProduct(id, req.user);
    return response({ res, statusCode: httpStatus.OK, data: product });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const products = await getProducts(req.user);
    return response({ res, statusCode: httpStatus.OK, data: products });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, detail } = req.body;
  try {
    const product = await updateProduct(id, req.user, {
      name,
      detail
    });
    return response({
      res,
      statusCode: httpStatus.OK,
      data: null,
      message: `Product with ID ${id} updated successfully.`
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    await deleteProduct(id, req.user);
    return response({
      res,
      statusCode: httpStatus.OK,
      data: null,
      message: "Successfully deleted"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  get,
  getAll,
  update,
  remove
};
