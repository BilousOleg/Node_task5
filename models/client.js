const mongoose = require('mongoose');
const { hashSync } = require('bcrypt');
const {
  EMAIL_VALIDATION_SCHEMA,
  CLIENT_NAME_SCHEMA,
} = require('../utils/validationSchemas');

const hashPassword = value => hashSync(value, process.env.SALT_ROUNDS);

const deliveryAddressSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    region: { type: String, trim: true },
    city: { type: String, trim: true },
    street: { type: String, trim: true },
    building: { type: String, trim: true },
    apartment: { type: String, trim: true },
    postalCode: { type: String, trim: true },
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: v => v != null && CLIENT_NAME_SCHEMA.isValidSync(v),
      message: 'Invalid client name',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => EMAIL_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Incorrect email',
    },
  },
  passwHash: {
    type: String,
    required: true,
    set: hashPassword,
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    default: undefined,
  },
  favoriteProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

clientSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
