const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: {
    type: String,
  },
  description: {
    type: String,
  },
  cathegory: {
    type: String,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
  },
  count: {
    type: Number,
  },
  // TODO: discounts, reviews
});
