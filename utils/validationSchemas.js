const yup = require('yup');
const mongoose = require('mongoose');
const { PRICE_REGEX, CATEGORIES } = require('../constants');

const EMAIL_VALIDATION_SCHEMA = yup.string().email();

const PRICE_VALIDATION_SCHEMA = yup
  .string()
  .trim()
  .matches(
    PRICE_REGEX,
    'Price must have up to 8 integer digits and 2 decimal places'
  )
  .test(
    'positive',
    'Price must be greater than 0',
    value => value == null || Number(value) > 0
  );

const noWhitespaceString = (fieldName, { minLen, maxLen } = {}) => {
  let schema = yup
    .string()
    .trim()
    .test(
      'not-blank',
      `${fieldName} cannot be empty or contain only whitespaces`,
      value => value == null || value.trim().length > 0
    );

  if (minLen != null) {
    schema = schema.min(
      minLen,
      `${fieldName} must be at least ${minLen} characters long`
    );
  }

  if (maxLen != null) {
    schema = schema.max(
      maxLen,
      `${fieldName} cannot exceed ${maxLen} characters`
    );
  }

  return schema;
};

const integerNumber = (fieldName, { min, max, defaultValue } = {}) => {
  let schema = yup
    .number()
    .typeError(`${fieldName} must be a number`)
    .integer(`${fieldName} must be an integer`);

  if (min != null) {
    schema = schema.min(min, `${fieldName} cannot be less than ${min}`);
  }

  if (max != null) {
    schema = schema.max(max, `${fieldName} cannot exceed ${max}`);
  }

  if (defaultValue != null) {
    schema = schema.default(defaultValue);
  }

  return schema;
};

const enumField = (fieldName, enumList) => yup.string().oneOf(enumList);

const PRODUCT_NAME_SCHEMA = noWhitespaceString('Product name', {
  minLen: 2,
  maxLen: 128,
});

const DESCRIPTION_SCHEMA = noWhitespaceString('Description', {
  minLen: 50,
  maxLen: 2000,
});

const CATEGORY_SCHEMA = enumField('Category', CATEGORIES);

const COUNT_SCHEMA = integerNumber('Count', { min: 0 });

const DISCOUNT_SCHEMA = integerNumber('Discount', {
  min: 0,
  max: 100,
}).nullable();

const CLIENT_NAME_SCHEMA = noWhitespaceString('Client name', {
  minLen: 2,
  maxLen: 64,
});

const REVIEW_COMMENT_SCHEMA = noWhitespaceString('Comment', {
  maxLen: 2000,
});

module.exports = {
  EMAIL_VALIDATION_SCHEMA,
  PRICE_VALIDATION_SCHEMA,
  PRODUCT_NAME_SCHEMA,
  DESCRIPTION_SCHEMA,
  COUNT_SCHEMA,
  DISCOUNT_SCHEMA,
  CLIENT_NAME_SCHEMA,
  REVIEW_COMMENT_SCHEMA,
};

module.exports.PAGINATION_VALIDATION_SCHEMA = yup.object({
  page: integerNumber('Page', { min: 1, defaultValue: 1 }),
  results: integerNumber('Results', { min: 1, max: 100, defaultValue: 10 }),
});

module.exports.ID_VALIDATION_SCHEMA = yup
  .string()
  .required('Id is required')
  .test('object-id', 'Invalid id format', value =>
    mongoose.isObjectIdOrHexString(value)
  );

module.exports.CREATE_PRODUCT_VALIDATION_SCHEMA = yup.object({
  productName: PRODUCT_NAME_SCHEMA.required('Product name is required'),
  description: DESCRIPTION_SCHEMA.required('Description is required'),
  category: CATEGORY_SCHEMA.required(`Category is required`),
  price: PRICE_VALIDATION_SCHEMA.required('Price is required'),
  count: COUNT_SCHEMA.required('Count is required'),
  discount: DISCOUNT_SCHEMA,
});

module.exports.UPDATE_PRODUCT_VALIDATION_SCHEMA = yup.object({
  productName: PRODUCT_NAME_SCHEMA,
  description: DESCRIPTION_SCHEMA,
  category: CATEGORY_SCHEMA,
  price: PRICE_VALIDATION_SCHEMA,
  count: COUNT_SCHEMA,
  discount: DISCOUNT_SCHEMA,
});
