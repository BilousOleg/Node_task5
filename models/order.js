const mongoose = require('mongoose');
const convertDecimal128 = require('../utils/convertDecimal128');
const {
  PRICE_VALIDATION_SCHEMA,
  QUANTITY_VALIDATION_SCHEMA,
  PRODUCT_NAME_VALIDATION_SCHEMA,
  DISCOUNT_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');
const { ORDER_STATUSES } = require('../constants');

const convertUnitPrice = convertDecimal128('unitPrice');
const convertOriginalUnitPrice = convertDecimal128('originalUnitPrice');
const convertTotalPrice = convertDecimal128('totalPrice');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
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
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: v => v != null && QUANTITY_VALIDATION_SCHEMA.isValidSync(v),
        message: 'Quantity must be an integer, greater than zero',
      },
    },
    originalUnitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: v =>
          v != null && PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
        message: 'Price must be positive and have at most 2 decimal places',
      },
    },
    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: v =>
          v != null && PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
        message: 'Price must be positive and have at most 2 decimal places',
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
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: items => items.length > 0,
        message: 'Order must contain at least one product',
      },
    },
    totalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: v =>
          v != null && PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
        message:
          'Total price must be positive and have at most 2 decimal places',
      },
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'new',
      required: true,
    },
  },
  {
    // Для дати створення
    timestamps: true,
  }
);

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    convertTotalPrice(doc, ret);

    if (Array.isArray(ret.items)) {
      ret.items = ret.items.map(item => {
        convertUnitPrice(doc, item);
        convertOriginalUnitPrice(doc, item);
        return item;
      });
    }

    delete ret.updatedAt;
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
