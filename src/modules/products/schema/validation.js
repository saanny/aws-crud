const Joi = require("joi");

const inputCreateProduct = {
  body: {
    name: Joi.string().required(),
    detail: Joi.string().required()
  }
};

const inputUpdateProduct = {
  params: {
    id: Joi.string().required()
  },
  body: {
    name: Joi.string(),
    detail: Joi.string()
  }
};
const getAllProducts = {
  query: {
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1)
  }
};
const findProductById = {
  params: {
    id: Joi.string().required()
  }
};
const deleteProductById = {
  params: {
    id: Joi.string().required()
  }
};

module.exports = {
  inputCreateProduct,
  inputUpdateProduct,
  getAllProducts,
  findProductById,
  deleteProductById
};
