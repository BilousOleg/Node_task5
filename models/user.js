const mongoose = require('mongoose');
const { EMAIL_VALIDATION_SCHEMA } = require('../utils/validationSchemas');
const { GENDERS } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 64,
      match: /^[A-Z][a-z]+$/,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 64,
      match: /^[A-Z][a-z]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: v => EMAIL_VALIDATION_SCHEMA.isValidSync(v),
      },
    },
    birthday: {
      type: Date,
      max: new Date(),
    },
    gender: {
      type: String,
      enum: GENDERS,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
