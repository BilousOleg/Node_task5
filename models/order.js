const mongoose = require('mongoose');
const convertDecimal128 = require('../utils/convertDecimal128');
const { PRICE_VALIDATION_SCHEMA } = require('../utils/validationSchemas');
const { ORDER_STATUSES } = require('../constants');

const convertUnitPrice = convertDecimal128('unitPrice');
const convertTotalPrice = convertDecimal128('totalPrice');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: [0.01, 'Price must be greater than 0'],
      validate: {
        validator: v => PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
        message: 'Price must be positive and have at most 2 decimal places',
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
      min: [0.01, 'Total price must be greater than 0'],
      validate: {
        validator: v => PRICE_VALIDATION_SCHEMA.isValidSync(v.toString()),
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
        return item;
      });
    }

    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
