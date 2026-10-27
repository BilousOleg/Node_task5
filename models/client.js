const mongoose = require('mongoose');
const { hashSync } = require('bcrypt');
const {
  EMAIL_VALIDATION_SCHEMA,
  CLIENT_NAME_VALIDATION_SCHEMA,
  DELIVERY_ADDRESS_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');

const hashPassword = value => {
  if (value == null) return value;

  return hashSync(value, Number(process.env.SALT_ROUNDS));
};

const deliveryAddressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.country.isValidSync(v),
        message: 'Invalid country',
      },
    },
    region: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.region.isValidSync(v),
        message: 'Invalid region',
      },
    },
    city: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.city.isValidSync(v),
        message: 'Invalid city',
      },
    },
    street: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.street.isValidSync(v),
        message: 'Invalid street',
      },
    },
    building: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.building.isValidSync(v),
        message: 'Invalid building',
      },
    },
    apartment: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.apartment.isValidSync(v),
        message: 'Invalid apartment',
      },
    },
    postalCode: {
      type: String,
      trim: true,
      validate: {
        validator: v =>
          v == null ||
          DELIVERY_ADDRESS_VALIDATION_SCHEMA.fields.postalCode.isValidSync(v),
        message: 'Invalid postal code',
      },
    },
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: v => v != null && CLIENT_NAME_VALIDATION_SCHEMA.isValidSync(v),
      message: 'Invalid client name',
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate: {
      validator: v => v != null && EMAIL_VALIDATION_SCHEMA.isValidSync(v),
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
    delete ret.passwHash;
    return ret;
  },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
