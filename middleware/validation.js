const {
  PAGINATION_VALIDATION_SCHEMA,
  ID_VALIDATION_SCHEMA,
  CREATE_PRODUCT_VALIDATION_SCHEMA,
  UPDATE_PRODUCT_VALIDATION_SCHEMA,
  CREATE_CLIENT_VALIDATION_SCHEMA,
  UPDATE_CLIENT_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');
const validateWithSchema = require('../utils/validateWithSchema');

module.exports.validatePagination = async (req, res, next) => {
  try {
    req.query = await PAGINATION_VALIDATION_SCHEMA.validate(req.query, {
      abortEarly: false,
    });

    next();
  } catch (err) {
    next(err);
  }
};

module.exports.validateId = async (req, res, next) => {
  const { id } = req.params;

  try {
    req.params.id = await ID_VALIDATION_SCHEMA.validate(id);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.validateProductOnCreate = validateWithSchema(
  CREATE_PRODUCT_VALIDATION_SCHEMA
);

module.exports.validateProductOnUpdate = validateWithSchema(
  UPDATE_PRODUCT_VALIDATION_SCHEMA
);

module.exports.validateClientOnCreate = validateWithSchema(
  CREATE_CLIENT_VALIDATION_SCHEMA
);

module.exports.validateClientOnUpdate = validateWithSchema(
  UPDATE_CLIENT_VALIDATION_SCHEMA
);
