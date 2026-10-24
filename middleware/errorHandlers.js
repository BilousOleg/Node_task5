const { ValidationError: YupValidationError } = require('yup');

module.exports.validationErrorHandler = (err, req, res, next) => {
  if (err instanceof YupValidationError) {
    const errors = err.errors.map(m => ({ status: 422, title: m }));

    return res.status(422).send(errors);
  }

  next(err);
};

module.exports.errorHandler = async (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }

  const status = err.status || 500;
  const message = err.message || 'Server Error';

  res.status(status).send([{ status, title: message }]);
};
