const { PRICE_REGEX } = require('../constants');

const EMAIL_VALIDATION_SCHEMA = yup.string().email();

const PRICE_VALIDATION_SCHEMA = yup
  .number()
  .required('Price is required')
  .min(0.01, 'Price must be greater than 0')
  .test(
    'decimal-places',
    'Price must have at most 2 decimal places',
    value => value == null || PRICE_REGEX.test(String(value))
  );

const noWhitespaceString = (
  fieldName,
  { minLen, maxLen, required = true } = {}
) => {
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

  if (required) {
    schema = schema.required(`${fieldName} is required`);
  }

  return schema;
};

const PRODUCT_NAME_SCHEMA = noWhitespaceString('Product name', {
  minLen: 2,
  maxLen: 128,
});

const DESCRIPTION_SCHEMA = noWhitespaceString('Description', {
  minLen: 50,
  maxLen: 2000,
});

const CLIENT_NAME_SCHEMA = noWhitespaceString('Client name', {
  minLen: 2,
  maxLen: 64,
});

const REVIEW_COMMENT_SCHEMA = noWhitespaceString('Comment', {
  maxLen: 2000,
  required: false,
});

module.exports = {
  EMAIL_VALIDATION_SCHEMA,
  PRICE_VALIDATION_SCHEMA,
  PRODUCT_NAME_SCHEMA,
  DESCRIPTION_SCHEMA,
  CLIENT_NAME_SCHEMA,
  REVIEW_COMMENT_SCHEMA,
};
