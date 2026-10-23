const {
  PAGINATION_VALIDATION_SCHEMA,
  ID_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');

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
