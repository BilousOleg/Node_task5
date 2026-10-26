const createHttpError = require('http-errors');
const { Product } = require('../models');

module.exports.createProduct = async (req, res, next) => {
  const { body } = req;

  try {
    const createdProduct = await Product.create(body);

    if (!createdProduct) {
      return next(createHttpError(400, 'Bad Request'));
    }

    res.status(201).send({ data: createdProduct });
  } catch (err) {
    next(err);
  }
};

module.exports.getProducts = async (req, res, next) => {
  const { limit, skip } = req.pagination;

  try {
    const foundProducts = await Product.find()
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skip);

    res.status(200).send({ data: foundProducts });
  } catch (err) {
    next(err);
  }
};

module.exports.getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundProduct = await Product.findById(id);

    if (!foundProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    res.status(200).send({ data: foundProduct });
  } catch (err) {
    next(err);
  }
};
