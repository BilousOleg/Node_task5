const mongoose = require('mongoose');
const {
  REVIEW_COMMENT_VALIDATION_SCHEMA,
  RATING_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');

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
      validate: {
        validator: v => v != null && RATING_VALIDATION_SCHEMA.isValidSync(v),
        message: 'Rating must be an integer from 1 to 5',
      },
    },
    comment: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: v =>
          v != null && REVIEW_COMMENT_VALIDATION_SCHEMA.isValidSync(v),
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
