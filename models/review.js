const mongoose = require('mongoose');
const { REVIEW_COMMENT_SCHEMA } = require('../utils/validationSchemas');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    comment: {
      type: String,
      trim: true,
      validate: {
        validator: v => REVIEW_COMMENT_SCHEMA.isValidSync(v),
        message: 'Invalid comment',
      },
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
