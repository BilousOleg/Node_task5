const yup = require('yup');
const mongoose = require('mongoose');
const { PRICE_REGEX, CATEGORIES, ORDER_STATUSES } = require('../constants');

const EMAIL_VALIDATION_SCHEMA = yup
  .string()
  .trim()
  .lowercase()
  .email('Incorrect email');

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

const enumField = enumList => yup.string().oneOf(enumList);

const PRODUCT_NAME_VALIDATION_SCHEMA = noWhitespaceString('Product name', {
  minLen: 2,
  maxLen: 128,
});

const DESCRIPTION_VALIDATION_SCHEMA = noWhitespaceString('Description', {
  minLen: 50,
  maxLen: 2000,
});

const CATEGORY_VALIDATION_SCHEMA = enumField(CATEGORIES);

const COUNT_VALIDATION_SCHEMA = integerNumber('Count', { min: 0 });

const DISCOUNT_VALIDATION_SCHEMA = integerNumber('Discount', {
  min: 0,
  max: 100,
}).nullable();

const CLIENT_NAME_VALIDATION_SCHEMA = noWhitespaceString('Client name', {
  minLen: 2,
  maxLen: 64,
});

const REVIEW_COMMENT_VALIDATION_SCHEMA = noWhitespaceString('Comment', {
  maxLen: 2000,
});

const PASSWORD_VALIDATION_SCHEMA = yup
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .test(
    'not-blank',
    'Password cannot contain only whitespaces',
    value => value == null || value.trim().length > 0
  );

const DELIVERY_ADDRESS_VALIDATION_SCHEMA = yup
  .object({
    country: noWhitespaceString('Country', { maxLen: 100 }),
    region: noWhitespaceString('Region', { maxLen: 100 }),
    city: noWhitespaceString('City', { maxLen: 100 }),
    street: noWhitespaceString('Street', { maxLen: 150 }),
    building: noWhitespaceString('Building', { maxLen: 20 }),
    apartment: noWhitespaceString('Apartment', { maxLen: 20 }),
    postalCode: noWhitespaceString('Postal code', { maxLen: 20 }),
  })
  .default(undefined)
  .optional();

const QUANTITY_VALIDATION_SCHEMA = integerNumber('Quantity', { min: 1 });

const ID_VALIDATION_SCHEMA = yup
  .string()
  .required('Id is required')
  .test('object-id', 'Invalid id format', value =>
    mongoose.isObjectIdOrHexString(value)
  );

const RATING_VALIDATION_SCHEMA = integerNumber('Rating', { min: 1, max: 5 });

module.exports = {
  EMAIL_VALIDATION_SCHEMA,
  PRICE_VALIDATION_SCHEMA,
  PRODUCT_NAME_VALIDATION_SCHEMA,
  DESCRIPTION_VALIDATION_SCHEMA,
  COUNT_VALIDATION_SCHEMA,
  DISCOUNT_VALIDATION_SCHEMA,
  CLIENT_NAME_VALIDATION_SCHEMA,
  PASSWORD_VALIDATION_SCHEMA,
  DELIVERY_ADDRESS_VALIDATION_SCHEMA,
  REVIEW_COMMENT_VALIDATION_SCHEMA,
  QUANTITY_VALIDATION_SCHEMA,
  RATING_VALIDATION_SCHEMA,
  ID_VALIDATION_SCHEMA,
};

module.exports.PAGINATION_VALIDATION_SCHEMA = yup.object({
  page: integerNumber('Page', { min: 1, defaultValue: 1 }),
  results: integerNumber('Results', { min: 1, max: 100, defaultValue: 10 }),
});

module.exports.CREATE_PRODUCT_VALIDATION_SCHEMA = yup.object({
  productName: PRODUCT_NAME_VALIDATION_SCHEMA.required(
    'Product name is required'
  ),
  description: DESCRIPTION_VALIDATION_SCHEMA.required(
    'Description is required'
  ),
  category: CATEGORY_VALIDATION_SCHEMA.required(`Category is required`),
  price: PRICE_VALIDATION_SCHEMA.required('Price is required'),
  count: COUNT_VALIDATION_SCHEMA.required('Count is required'),
  discount: DISCOUNT_VALIDATION_SCHEMA,
});

module.exports.UPDATE_PRODUCT_VALIDATION_SCHEMA = yup.object({
  productName: PRODUCT_NAME_VALIDATION_SCHEMA,
  description: DESCRIPTION_VALIDATION_SCHEMA,
  category: CATEGORY_VALIDATION_SCHEMA,
  price: PRICE_VALIDATION_SCHEMA,
  count: COUNT_VALIDATION_SCHEMA,
  discount: DISCOUNT_VALIDATION_SCHEMA,
});

module.exports.CREATE_CLIENT_VALIDATION_SCHEMA = yup.object({
  clientName: CLIENT_NAME_VALIDATION_SCHEMA.required('Client name is required'),
  email: EMAIL_VALIDATION_SCHEMA.required('Email is required'),
  password: PASSWORD_VALIDATION_SCHEMA.required('Password is required'),
  deliveryAddress: DELIVERY_ADDRESS_VALIDATION_SCHEMA,
});

module.exports.UPDATE_CLIENT_VALIDATION_SCHEMA = yup.object({
  clientName: CLIENT_NAME_VALIDATION_SCHEMA,
  email: EMAIL_VALIDATION_SCHEMA,
  password: PASSWORD_VALIDATION_SCHEMA,
  deliveryAddress: DELIVERY_ADDRESS_VALIDATION_SCHEMA,
});

const ORDER_ITEM_VALIDATION_SCHEMA = yup.object({
  productId: ID_VALIDATION_SCHEMA.required('Product ID is required'),
  quantity: QUANTITY_VALIDATION_SCHEMA.required('Quantity is required'),
});

module.exports.CREATE_ORDER_VALIDATION_SCHEMA = yup.object({
  items: yup
    .array()
    .of(ORDER_ITEM_VALIDATION_SCHEMA)
    .min(1, 'Order must contain at least one product')
    .required('Order items are required'),
});

module.exports.CREATE_REVIEW_VALIDATION_SCHEMA = yup.object({
  rating: RATING_VALIDATION_SCHEMA.required('Rating is required'),
  comment: REVIEW_COMMENT_VALIDATION_SCHEMA.required('Comment is required'),
});

module.exports.UPDATE_REVIEW_VALIDATION_SCHEMA = yup.object({
  rating: RATING_VALIDATION_SCHEMA,
  comment: REVIEW_COMMENT_VALIDATION_SCHEMA,
});
