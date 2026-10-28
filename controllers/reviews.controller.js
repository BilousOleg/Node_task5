const createHttpError = require('http-errors');
const { Review, Product, Client } = require('../models');

module.exports.createProductReviewById = async (req, res, next) => {
  const {
    params: { id, productId },
    body: { rating, comment },
  } = req;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    if (foundClient.status === 'deleted') {
      return next(createHttpError(403, 'Deleted Client Cannot Create Reviews'));
    }

    const foundProduct = await Product.findById(productId);

    if (!foundProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    const createdReview = await Review.create({
      productId: foundProduct._id,
      clientId: foundClient._id,
      rating,
      comment,
    });

    res.status(201).send({ data: createdReview });
  } catch (err) {
    next(err);
  }
};

module.exports.getProductReviews = async (req, res, next) => {
  const {
    params: { id },
    pagination: { limit, skip },
  } = req;

  try {
    const foundProduct = await Product.findById(id);

    if (!foundProduct) {
      return next(createHttpError(404, 'Product Not Found'));
    }

    const foundReviews = await Review.find({ productId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.status(200).send({ data: foundReviews });
  } catch (err) {
    next(err);
  }
};

module.exports.getClientReviews = async (req, res, next) => {
  const {
    params: { id },
    pagination: { limit, skip },
  } = req;

  try {
    const foundClient = await Client.findById(id);

    if (!foundClient) {
      return next(createHttpError(404, 'Client Not Found'));
    }

    const foundReviews = await Review.find({ clientId: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.status(200).send({ data: foundReviews });
  } catch (err) {
    next(err);
  }
};

module.exports.getReviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundReview = await Review.findById(id);

    if (!foundReview) {
      return next(createHttpError(404, 'Review Not Found'));
    }

    res.status(200).send({ data: foundReview });
  } catch (err) {
    next(err);
  }
};

module.exports.updateReviewById = async (req, res, next) => {
  const {
    params: { id },
    body,
  } = req;

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updatedReview) {
      return next(createHttpError(404, 'Review Not Found'));
    }

    res.status(200).send({ data: updatedReview });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return next(createHttpError(404, 'Review Not Found'));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
