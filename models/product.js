const mongoose = require('mongoose');
const convertDecimal128 = require('../utils/convertDecimal128');
const {
  PRODUCT_NAME_VALIDATION_SCHEMA,
  DESCRIPTION_VALIDATION_SCHEMA,
  PRICE_VALIDATION_SCHEMA,
  COUNT_VALIDATION_SCHEMA,
  DISCOUNT_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');
const { CATEGORIES } = require('../constants');

const convertPrice = convertDecimal128('price');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v =>
        v != null && PRODUCT_NAME_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Invalid product name',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => v != null && DESCRIPTION_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Invalid description',
    },
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    validate: {
      validator: v => v != null && PRICE_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Price must be non-negative and have at most 2 decimal places',
    },
  },
  count: {
    type: Number,
    required: true,
    validate: {
      validator: v => v != null && COUNT_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Count must be non-negative integer',
    },
  },
  discount: {
    type: Number,
    default: null,
    validate: {
      validator: v => v == null || DISCOUNT_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Discount must be an integer between 0 and 100',
    },
  },
});

productSchema.set('toJSON', {
  transform: (doc, ret) => {
    convertPrice(doc, ret);
    delete ret.__v;
    return ret;
  },
});

productSchema.set('toObject', {
  transform: convertPrice,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
