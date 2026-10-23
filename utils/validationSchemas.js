const yup = require('yup');
const mongoose = require('mongoose');

const positiveIntegerValidationSchema = (fieldName, defaultValue) =>
  yup
    .number()
    .typeError(`${fieldName} must be a number`)
    .integer(`${fieldName} must be an integer`)
    .min(1, `${fieldName} must be greater than 0`)
    .default(defaultValue);

module.exports.PAGINATION_VALIDATION_SCHEMA = yup.object({
  page: positiveIntegerValidationSchema('Page', 1),
  results: positiveIntegerValidationSchema('Results', 10).max(
    100,
    'Results must not exceed 100'
  ),
});

module.exports.ID_VALIDATION_SCHEMA = yup
  .string()
  .required('Id is required')
  .test('object-id', 'Invalid id format', value =>
    mongoose.isObjectIdOrHexString(value)
  );
