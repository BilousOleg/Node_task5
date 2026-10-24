const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const noWhitespaceString = {
  validator: value => typeof value === 'string' && value.trim().length > 0,
  message: 'Field cannot be empty or contain only whitespaces',
};

const phoneSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      validate: noWhitespaceString,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      validate: noWhitespaceString,
      trim: true,
    },
    // Для userId немає умови обов'язковості - телефон може не мати власника
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    manufacturedYear: {
      type: Number,
      required: true,
      min: 1970,
      max: currentYear,
      validate: {
        validator: Number.isInteger,
        message: 'Manufactured year must be integer',
      },
    },
    ramSize: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'RAM size must be integer',
      },
    },
    cpu: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
      validate: noWhitespaceString,
      trim: true,
    },
    screenDiagonal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 1,
      max: 99.99,
      validate: {
        validator: value => /^\d{1,2}(\.\d{1,2})?$/.test(value.toString()),
        message:
          'Diagonal must be a decimal number from 1 to 99.99, with 2 symbols precision',
      },
    },
    hasNfc: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

phoneSchema.index({ brand: 1, model: 1 }, { unique: true });

const convertDecimal128 = (doc, ret) => {
  if (ret.screenDiagonal != null) {
    ret.screenDiagonal = Number(ret.screenDiagonal.toString());
  }

  return ret;
};

phoneSchema.set('toJSON', {
  transform: convertDecimal128,
});

phoneSchema.set('toObject', {
  transform: convertDecimal128,
});

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;
