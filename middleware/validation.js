const {
  CREATE_PHONE_VALIDATION_SCHEMA,
  UPDATE_PHONE_VALIDATION_SCHEMA,
  PAGINATION_VALIDATION_SCHEMA,
  ID_VALIDATION_SCHEMA,
  CREATE_USER_VALIDATION_SCHEMA,
} = require('../utils/validationSchemas');

module.exports.validatePhoneOnCreate = async (req, res, next) => {
  const { body } = req;

  try {
    req.body = await CREATE_PHONE_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });

    next();
  } catch (err) {
    next(err);
  }
};

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

module.exports.validatePhoneOnUpdate = async (req, res, next) => {
  const { body } = req;

  try {
    req.body = await UPDATE_PHONE_VALIDATION_SCHEMA.validate(body, {
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

module.exports.validateUserOnCreate = async (req, res, next) => {
  const { body } = req;

  try {
    req.body = await CREATE_USER_VALIDATION_SCHEMA.validate(body, {
      abortEarly: false,
    });

    next();
  } catch (err) {
    next(err);
  }
};
