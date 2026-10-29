const createHttpError = require('http-errors');
const { Product, Client } = require('../models');

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

module.exports.updateProductById = async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    res.status(200).send({ data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    await Client.updateMany(
      { favoriteProducts: deletedProduct._id },
      { $pull: { favoriteProducts: deletedProduct._id } }
    );

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
