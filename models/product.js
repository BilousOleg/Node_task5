const mongoose = require('mongoose');
const convertDecimal128 = require('../utils/convertDecimal128');
const {
  PRODUCT_NAME_SCHEMA,
  DESCRIPTION_SCHEMA,
} = require('../utils/validationSchemas');
const { CATEGORIES } = require('../constants');

const convertPrice = convertDecimal128('price');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => v != null && PRODUCT_NAME_SCHEMA.isValidSync(v),
      message: 'Invalid product name',
    },
  },
  description: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: v => v != null && DESCRIPTION_SCHEMA.isValidSync(v),
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
    min: [0.01, 'Price must be greater than 0'],
    validate: {
      validator: v => PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
      message: 'Price must be positive and have at most 2 decimal places',
    },
  },
  count: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Count must be integer',
    },
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Discount cannot be less than 0'],
    max: [100, 'Discount cannot exceed 100'],
    validate: {
      validator: Number.isInteger,
      message: 'Discount must be an integer',
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
